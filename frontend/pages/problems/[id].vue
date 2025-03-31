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
        <button @click="toggleHints" class="btn btn-outline btn-sm">
          {{ showHints ? 'Hide Hints' : 'Show Hints' }}
        </button>
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

      <div class="card bg-base-100 shadow-xl mb-8" v-if="showHints">
        <div class="card-body">
          <h2 class="card-title">Hints</h2>
          <div v-for="(hint, index) in problem.hints" :key="index" class="mt-3">
            <div class="font-semibold">Hint {{ index + 1 }}:</div>
            <p>{{ hint }}</p>
          </div>
        </div>
      </div>

      <!-- Adaptive Feedback based on BKT model -->
      <div v-if="!showHints">
        <AdaptiveFeedback
          :problem-id="problem.id"
          :step-id="currentStep?.id"
          :step-type="getStepType(currentStepIndex)"
          :difficulty="problem.difficulty"
          :hints="problem.hints"
          :show-hint="showHints"
          @hint-provided="handleAdaptiveHint"
        />
      </div>

      <StepsProgress :steps="steps" :current-step="currentStepIndex" />

      <div class="card bg-base-100 shadow-xl mb-8">
        <div class="card-body">
          <h2 class="card-title">{{ currentStep.title }}</h2>
          <p class="mb-4">{{ currentStep.instructions }}</p>

          <div class="mb-6">
            <component
              :is="stepComponents[currentStep.type]"
              :data="currentStep.data"
              @submit="handleStepSubmission"
            />
          </div>

          <FeedbackMessage
            :message="feedbackMessage"
            :is-correct="lastSubmissionCorrect"
            :is-hint="isHintMessage"
            :detailed-feedback="detailedFeedback"
            :show-hint-button="!showHints"
            @request-hint="requestHint"
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
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProblemStore } from '~/stores/problemStore';
import { useUserStore } from '~/stores/userStore';
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
    title: step.title,
    instructions: step.instructions,
    type: step.type,
    data: step.data
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

  if (result.correct) {
    stepsCompleted.value[currentStepIndex.value] = true;
    feedbackMessage.value = 'Correct! You can proceed to the next step.';
    lastSubmissionCorrect.value = true;

    // Reset hint index when getting correct answer
    currentHintIndex.value = 0;

    // Update user progress in store
    userStore.updateProblemProgress(problemId, stepId, true, problem.value.difficulty);
  } else {
    feedbackMessage.value = 'That\'s not quite right. Please try again.';
    lastSubmissionCorrect.value = false;

    // Add detailed feedback for partial results if available
    if (result.partialResults) {
      detailedFeedback.value = generateDetailedFeedback(result);
    }

    // Update user progress in store (track the attempt)
    userStore.updateProblemProgress(problemId, stepId, false, problem.value.difficulty);
  }
};

const generateDetailedFeedback = (result) => {
  const feedback = [];

  // Handle multiple choice question with multiple correct answers
  if (currentStep.value.type === QUESTION_TYPE.MULTIPLE_CHOICE && Array.isArray(currentStep.value.data.correctAnswer)) {
    feedback.push('Select all correct options to proceed.');
  }

  // Handle fill-in-blank questions
  if (currentStep.value.type === QUESTION_TYPE.FILL_IN_BLANK && result.partialResults) {
    result.partialResults.forEach((correct, index) => {
      if (!correct) {
        feedback.push(`Answer ${index + 1} is incorrect.`);
      }
    });
  }

  // Handle drag-drop questions
  if (currentStep.value.type === QUESTION_TYPE.DRAG_DROP) {
    feedback.push('The order is not correct. Try a different arrangement.');
  }

  return feedback;
};

const previousStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--;
    resetFeedback();
    currentHintIndex.value = 0; // Reset hint index when changing steps
  }
};

const nextStep = () => {
  if (currentStepIndex.value < steps.length - 1) {
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

// Handle adaptive hints
const handleAdaptiveHint = (hint) => {
  feedbackMessage.value = hint;
  isHintMessage.value = true;
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