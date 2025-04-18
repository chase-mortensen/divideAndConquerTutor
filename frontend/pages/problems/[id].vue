<template>
  <NuxtLayout name="default">
    <div v-if="loading" class="flex justify-center items-center min-h-[50vh]">
      <div class="loading loading-spinner loading-lg"></div>
    </div>
    <div v-else>
      <div class="flex justify-between items-start mb-6">
        <div>
          <h1 class="text-3xl font-bold">{{ problem.title }}</h1>
          <div class="mt-2 flex items-center gap-3">
            <div class="badge" :class="{
              'badge-primary': problem.difficulty === DIFFICULTY.BEGINNER,
              'badge-secondary': problem.difficulty === DIFFICULTY.INTERMEDIATE,
              'badge-accent': problem.difficulty === DIFFICULTY.ADVANCED
            }">{{ problem.difficulty }}</div>
            <div class="badge badge-outline">{{ problem.category }}</div>
            <div class="text-sm">Est. Time: {{ problem.estimatedTime }}</div>
          </div>
        </div>
        <!-- <button @click="toggleHints" class="btn btn-outline btn-sm">
          {{ showHints ? 'Hide Hints' : 'Show Hints' }}
        </button> -->
      </div>

      <div class="card bg-base-100 shadow-xl mb-8">
        <div class="card-body">
          <h2 class="card-title">Problem Description</h2>
          <p>{{ problem.description }}</p>
          <div class="mt-4">
            <h3 class="font-semibold">Learning Objectives:</h3>
            <ul class="list-disc list-inside mt-2">
              <li v-for="(objective, index) in problem.learningObjectives" :key="index">
                {{ objective }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- <div class="card bg-base-100 shadow-xl mb-8" v-if="showHints">
        <div class="card-body">
          <h2 class="card-title">Hints</h2>
          <div v-for="(hint, index) in problem.hints" :key="index" class="mt-3">
            <div class="font-semibold">Hint {{ index + 1 }}:</div>
            <p>{{ hint }}</p>
          </div>
        </div>
      </div> -->

      <StepsProgress :steps="steps" :current-step="currentStepIndex" />

      <!-- Adaptive Feedback based on BKT model -->
      <div v-if="!showHints && (!lastSubmissionCorrect || isHintMessage)">
        <AdaptiveFeedback
          :problem-id="problem.id"
          :step-id="currentStep?.id"
          :step-type="getStepType(currentStepIndex)"
          :difficulty="problem.difficulty"
          :hints="getStepHints(currentStepIndex)"
          :show-hint="!lastSubmissionCorrect || isHintMessage"
          :question-type="currentStep?.type"
          :last-attempt-correct="lastSubmissionCorrect"
          :attempt-count="getCurrentStepAttemptCount()"
          @hint-provided="handleAdaptiveHint"
        />
      </div>

      <div class="card bg-base-100 shadow-xl mb-8" v-if="currentStep">
        <div class="card-body">
          <h2 class="card-title">{{ currentStep.title }}</h2>
          <p class="mb-4">{{ currentStep.instructions }}</p>

          <div class="mb-6">
            <component
              :is="stepComponents[currentStep.type]"
              :data="{
                ...currentStep.data,
                stepType: getStepType(currentStepIndex)
              }"
              @submit="handleStepSubmission"
            />
          </div>

          <FeedbackMessage
            v-if="!isHintMessage"
            :message="feedbackMessage"
            :is-correct="lastSubmissionCorrect"
            :detailed-feedback="detailedFeedback"
            :show-hint-button="false"
          />

          <StepNavigation
            :is-first-step="currentStepIndex === 0"
            :is-last-step="currentStepIndex === steps.length - 1"
            :can-progress="canProgressToNextStep"
            @previous="previousStep"
            @next="nextStep"
          />
        </div>
      </div>
      <h2
        v-else
        class="text-xl font-bold"
      >Missing Steps</h2>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProblemStore } from '~/stores/problemStore';
import { useUserStore } from '~/stores/userStore';
import { generateFeedback } from '~/stores/feedbackRules';
import MultipleChoiceQuestion from '~/components/questions/MultipleChoiceQuestion.vue';
import FreeTextQuestion from '~/components/questions/FreeTextQuestion.vue';
import FillInBlankQuestion from '~/components/questions/FillInBlankQuestion.vue';
import DragDropQuestion from '~/components/questions/DragDropQuestion.vue';
import StepsProgress from '~/components/problem-interface/StepsProgress.vue';
import StepNavigation from '~/components/problem-interface/StepNavigation.vue';
import FeedbackMessage from '~/components/feedback/FeedbackMessage.vue';
import AdaptiveFeedback from '~/components/feedback/AdaptiveFeedback.vue';
import { DIFFICULTY, STEP_TYPE, QUESTION_TYPE } from '~/constants';

// Register the step component types
const stepComponents = {
  [QUESTION_TYPE.MULTIPLE_CHOICE]: MultipleChoiceQuestion,
  [QUESTION_TYPE.FREE_TEXT]: FreeTextQuestion,
  [QUESTION_TYPE.FILL_IN_BLANK]: FillInBlankQuestion,
  [QUESTION_TYPE.DRAG_DROP]: DragDropQuestion
};

const route = useRoute();
const router = useRouter();
const problemStore = useProblemStore();
const userStore = useUserStore();

const loading = ref(true);
const problem = ref(null);
const currentStepIndex = ref(0);
const stepsCompleted = ref({});
const showHints = ref(false);
const feedbackMessage = ref('');
const lastSubmissionCorrect = ref(false);
const isHintMessage = ref(false);
const detailedFeedback = ref([]);
const currentHintIndex = ref(0);

// Computed properties to work with the problem data
const steps = computed(() => {
  if (!problem.value) return [];
  return problem.value.steps.map(step => ({
    title: step?.title,
    instructions: step?.instructions,
    type: step?.type,
    data: step?.data
  }));
});

const currentStep = computed(() => {
  if (!steps.value || steps.value.length === 0) return null;
  return steps.value[currentStepIndex.value];
});

const canProgressToNextStep = computed(() => {
  return stepsCompleted.value[currentStepIndex.value] === true;
});

// Methods
const toggleHints = () => {
  showHints.value = !showHints.value;

  // Reset the hint-specific state if hiding hints
  if (!showHints.value) {
    isHintMessage.value = false;
    if (feedbackMessage.value.startsWith('Hint:')) {
      feedbackMessage.value = '';
    }
  }
};

const requestHint = () => {
  // Show the available hint for the current step
  if (problem.value?.hints && problem.value.hints.length > 0) {
    const hintIndex = Math.min(currentHintIndex.value, problem.value.hints.length - 1);
    feedbackMessage.value = `Hint: ${problem.value.hints[hintIndex]}`;
    isHintMessage.value = true;
    currentHintIndex.value = Math.min(currentHintIndex.value + 1, problem.value.hints.length - 1);
  } else {
    feedbackMessage.value = 'No hints available for this problem.';
    isHintMessage.value = true;
  }
};

const handleStepSubmission = (result) => {
  isHintMessage.value = false;
  detailedFeedback.value = [];

  const problemId = problem.value.id;
  const stepId = problem.value.steps[currentStepIndex.value].id;
  const stepType = getStepType(currentStepIndex.value);
  const questionType = currentStep.value.type;
  const questionData = currentStep.value.data;

  if (result.correct) {
    stepsCompleted.value[currentStepIndex.value] = true;
    
    // Generate positive feedback based on step type
    const feedback = generatePositiveFeedback(stepType);
    feedbackMessage.value = feedback.message;
    lastSubmissionCorrect.value = true;

    // Reset hint index when getting correct answer
    currentHintIndex.value = 0;

    // Update user progress in store
    userStore.updateProblemProgress(problemId, stepId, true, problem.value.difficulty);
  } else {
    // If we have specific feedback details from the component, use those
    if (result.feedbackDetails && result.feedbackDetails.length > 0) {
      feedbackMessage.value = stepType === STEP_TYPE.PSEUDOCODE 
        ? "Your pseudocode implementation needs some improvements." 
        : "That's not quite right. Let's try a different approach.";
      detailedFeedback.value = result.feedbackDetails;
    } else {
      // Otherwise get rule-based feedback using the feedback service
      const feedback = generateRuleBasedFeedback(stepType, questionType, questionData, result);
      feedbackMessage.value = feedback.message;
      detailedFeedback.value = feedback.detailedFeedback;
    }
    
    lastSubmissionCorrect.value = false;

    // Update user progress in store (track the attempt)
    userStore.updateProblemProgress(problemId, stepId, false, problem.value.difficulty);
  }
};
  
// Generate positive feedback for correct answers
const generatePositiveFeedback = (stepType) => {
  // Use the same messages as in the feedbackRules.js file
  const messages = {
    'decomposition': [
      "Excellent! You've correctly identified how to break down this problem.",
      "Great job on decomposing the problem into manageable subproblems!",
      "Correct! You've found an effective way to decompose this problem."
    ],
    'baseCase': [
      "Perfect! You've identified the correct base case for this algorithm.",
      "That's right! This base case will properly terminate the recursive process.",
      "Correct! This base case correctly handles the smallest instance of the problem."
    ],
    'recurrence': [
      "Excellent work on formulating the recurrence relation!",
      "Correct! This recurrence relation accurately describes how subproblems combine.",
      "Perfect! You've identified how the solution is constructed from subproblems."
    ],
    'pseudocode': [
      "Well done! Your pseudocode correctly implements the divide-and-conquer approach.",
      "Excellent job on translating the algorithm into pseudocode!",
      "Perfect! Your solution correctly implements all the necessary steps."
    ]
  };

  // Get messages for this step type or use generic messages
  const stepMessages = messages[stepType] || [
    "Correct! Well done.",
    "That's right! Good job.",
    "Perfect! You've got it."
  ];

  // Select a random message from the available options
  const message = stepMessages[Math.floor(Math.random() * stepMessages.length)];

  return {
    message,
    detailedFeedback: []
  };
};

// Generate rule-based feedback for incorrect answers
const generateRuleBasedFeedback = (stepType, questionType, questionData, result) => {
  // Import functions from feedbackRules would be better, but for simplicity we'll implement inline
  
  // Base message templates for different step types
  const stepTypeMessages = {
    'decomposition': "That approach to decomposing the problem needs refinement.",
    'baseCase': "This base case might not handle all scenarios correctly.",
    'recurrence': "The recurrence relation doesn't correctly combine the subproblems.",
    'pseudocode': "Your pseudocode implementation needs some adjustments."
  };

  // Default message if step type not found
  const message = stepTypeMessages[stepType] || "That's not quite right. Let's try a different approach.";
  
  // Generate detailed feedback based on question type
  let detailedFeedback = [];
  
  switch(questionType) {
    case QUESTION_TYPE.MULTIPLE_CHOICE:
      if (Array.isArray(questionData.correctAnswer)) {
        detailedFeedback.push('Select all correct options to proceed.');
      } else {
        // Add step-specific guidance for multiple choice
        const mcFeedback = {
          'decomposition': ["Consider how the problem can be broken into smaller versions of itself."],
          'baseCase': ["The base case should be the simplest form of the problem that can be solved directly."],
          'recurrence': ["Think about how the solution to the original problem relates to solutions of the subproblems."],
          'pseudocode': ["Ensure your pseudocode correctly implements the divide, conquer, and combine steps."]
        };
        
        if (mcFeedback[stepType]) {
          detailedFeedback.push(mcFeedback[stepType][0]);
        }
      }
      break;
      
    case QUESTION_TYPE.FILL_IN_BLANK:
      if (result.partialResults) {
        // Count how many are incorrect
        const incorrectCount = result.partialResults.filter(r => !r).length;
        
        if (incorrectCount === result.partialResults.length) {
          detailedFeedback.push("All of your answers need revision.");
        } else if (incorrectCount > 1) {
          detailedFeedback.push(`${incorrectCount} of your answers need revision.`);
        } else {
          detailedFeedback.push("One of your answers needs revision.");
        }
        
        // Add specific feedback for each incorrect answer
        result.partialResults.forEach((correct, index) => {
          if (!correct) {
            // If questionData has hints for specific blanks, use them
            if (questionData.blankHints && questionData.blankHints[index]) {
              detailedFeedback.push(`Answer ${index + 1}: ${questionData.blankHints[index]}`);
            } else {
              detailedFeedback.push(`Answer ${index + 1} is incorrect.`);
            }
          }
        });
      }
      break;
      
    case QUESTION_TYPE.DRAG_DROP:
      detailedFeedback.push('The order is not correct. Try a different arrangement.');
      
      // For algorithm steps ordering
      if (stepType === 'pseudocode') {
        detailedFeedback.push("Remember that divide-and-conquer follows: divide the problem, solve subproblems, combine results.");
      }
      break;
      
    case QUESTION_TYPE.FREE_TEXT:
      // Generic feedback based on step type
      const ftFeedback = {
        'decomposition': ["Your approach may not effectively break down the problem."],
        'baseCase': ["Your base case might not be simple enough."],
        'recurrence': ["Your recurrence relation may not correctly capture the relationship between the problem and subproblems."],
        'pseudocode': ["Your pseudocode may be missing key divide-and-conquer elements."]
      };
      
      if (ftFeedback[stepType]) {
        detailedFeedback.push(ftFeedback[stepType][0]);
      } else {
        detailedFeedback.push("Your answer needs revision. Try again with a different approach.");
      }
      break;
      
    default:
      detailedFeedback.push("Please review your answer and try again.");
  }
  
  return {
    message,
    detailedFeedback
  };
};

const previousStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--;
    resetFeedback();
    currentHintIndex.value = 0; // Reset hint index when changing steps
  }
};

const nextStep = () => {
  if (currentStepIndex.value < steps.value.length - 1) {
    currentStepIndex.value++;
    resetFeedback();
    currentHintIndex.value = 0; // Reset hint index when changing steps
  } else {
    // Last step completed, handle completion
    completeExercise();
  }
};

const resetFeedback = () => {
  feedbackMessage.value = '';
  isHintMessage.value = false;
  detailedFeedback.value = [];
  lastSubmissionCorrect.value = false;
};

const completeExercise = () => {
  // Show completion message
  feedbackMessage.value = 'Congratulations! You have completed this exercise.';
  lastSubmissionCorrect.value = true;

  // In a real app, this would save progress to the backend
  // For now, we'll simulate a delay before redirecting
  setTimeout(() => {
    router.push('/problems');
  }, 2000);
};

// Helper method to convert step index to step type for BKT
const getStepType = (stepIndex) => {
  if (!problem.value || !problem.value.steps || stepIndex >= problem.value.steps.length) {
    return STEP_TYPE.DECOMPOSITION; // Default
  }

  // Map step ID to skill type
  const stepId = problem.value.steps[stepIndex].id;

  // Common step ID to skill type mapping
  const stepTypeMap = {
    [STEP_TYPE.DECOMPOSITION]: STEP_TYPE.DECOMPOSITION,
    [STEP_TYPE.BASE_CASE]: STEP_TYPE.BASE_CASE,
    [STEP_TYPE.RECURRENCE]: STEP_TYPE.RECURRENCE,
    [STEP_TYPE.PSEUDOCODE]: STEP_TYPE.PSEUDOCODE,
    [STEP_TYPE.ALGORITHM_STEPS]: STEP_TYPE.PSEUDOCODE // Map algorithm steps ordering to pseudocode skill
  };

  return stepTypeMap[stepId] || STEP_TYPE.DECOMPOSITION;
};

// Get the number of attempts for the current step
const getCurrentStepAttemptCount = () => {
  if (!problem.value) return 0;
  
  const problemId = problem.value.id;
  const stepId = problem.value.steps[currentStepIndex.value]?.id;
  
  // Get attempt count from user store if available
  if (userStore.progress.problemStats[problemId]?.stepData[stepId]) {
    return userStore.progress.problemStats[problemId].stepData[stepId].attempts || 0;
  }
  
  return 0;
};

// Handle adaptive hints
const handleAdaptiveHint = (hint) => {
  feedbackMessage.value = hint;
  isHintMessage.value = true;
};

// Get step-specific hints or fall back to problem-level hints
const getStepHints = (stepIndex) => {
  if (!problem.value) return [];
  
  // Try to get step-specific hints if available
  const step = problem.value.steps[stepIndex];
  if (step && step.hints && step.hints.length > 0) {
    return step.hints;
  }
  
  // Fall back to problem-level hints
  return problem.value.hints || [];
};

// Lifecycle hooks
onMounted(() => {
  const id = route.params.id;

  // Set current problem ID in store
  problemStore.setCurrentProblem(id);

  // Get problem data from store
  problem.value = problemStore.problemById(id);

  if (!problem.value) {
    // Handle problem not found
    router.push('/problems');
    return;
  }

  // Initialize steps completed state if user has progress
  if (userStore.progress.problemStats[id]) {
    const stepData = userStore.progress.problemStats[id].stepData;

    problem.value.steps.forEach((step, index) => {
      if (stepData[step.id] && stepData[step.id].correct) {
        stepsCompleted.value[index] = true;
      }
    });

    // If user was in the middle of this problem, try to resume at that step
    if (userStore.progress.inProgressProblems.includes(id)) {
      // Find the first incomplete step
      const firstIncompleteIndex = problem.value.steps.findIndex((step, index) =>
        !stepsCompleted.value[index]
      );

      if (firstIncompleteIndex !== -1) {
        currentStepIndex.value = firstIncompleteIndex;
      }
    }
  }

  loading.value = false;
});
</script>