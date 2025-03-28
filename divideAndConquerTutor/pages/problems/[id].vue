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
              'badge-primary': problem.difficulty === 'Beginner',
              'badge-secondary': problem.difficulty === 'Intermediate',
              'badge-accent': problem.difficulty === 'Advanced'
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

      <div class="mb-6">
        <ul class="steps steps-horizontal w-full">
          <li 
            v-for="(step, index) in steps" 
            :key="index"
            class="step" 
            :class="{ 'step-primary': currentStepIndex >= index }"
          >
            {{ step.title }}
          </li>
        </ul>
      </div>

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

          <div v-if="feedbackMessage" class="alert mb-4" :class="{
            'alert-success': lastSubmissionCorrect,
            'alert-error': !lastSubmissionCorrect
          }">
            <div>
              <span v-if="lastSubmissionCorrect">✓</span>
              <span v-else>✗</span>
              {{ feedbackMessage }}
            </div>
          </div>

          <div class="flex justify-between">
            <button 
              @click="previousStep" 
              class="btn" 
              :disabled="currentStepIndex === 0"
            >
              Previous
            </button>
            
            <button 
              @click="nextStep" 
              class="btn btn-primary" 
              :disabled="!canProgressToNextStep"
            >
              {{ currentStepIndex === steps.length - 1 ? 'Finish' : 'Next' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// This would typically be imported from component files
const MultipleChoiceQuestion = {
  props: ['data'],
  emits: ['submit'],
  setup(props, { emit }) {
    const selectedOption = ref(null);
    
    const submitAnswer = () => {
      emit('submit', {
        answer: selectedOption.value,
        correct: selectedOption.value === props.data.correctAnswer
      });
    };
    
    return {
      selectedOption,
      submitAnswer
    };
  },
  template: `
    <div>
      <div class="mb-4">
        <div class="font-medium mb-2">{{ data.question }}</div>
        <div v-for="(option, index) in data.options" :key="index" class="form-control">
          <label class="label cursor-pointer justify-start gap-4">
            <input 
              type="radio" 
              name="question" 
              class="radio" 
              :value="option"
              v-model="selectedOption"
            />
            <span class="label-text">{{ option }}</span>
          </label>
        </div>
      </div>
      <button @click="submitAnswer" class="btn btn-sm btn-primary" :disabled="!selectedOption">
        Submit Answer
      </button>
    </div>
  `
};

const FreeTextQuestion = {
  props: ['data'],
  emits: ['submit'],
  setup(props, { emit }) {
    const answer = ref('');
    
    const submitAnswer = () => {
      // Simplified validation for demo purposes
      const isCorrect = props.data.validateFunc(answer.value);
      emit('submit', {
        answer: answer.value,
        correct: isCorrect
      });
    };
    
    return {
      answer,
      submitAnswer
    };
  },
  template: `
    <div>
      <div class="mb-4">
        <div class="font-medium mb-2">{{ data.question }}</div>
        <textarea 
          v-model="answer" 
          class="textarea textarea-bordered w-full h-32"
          placeholder="Enter your answer here..."
        ></textarea>
      </div>
      <button @click="submitAnswer" class="btn btn-sm btn-primary" :disabled="!answer.trim()">
        Submit Answer
      </button>
    </div>
  `
};

// Register the step component types
const stepComponents = {
  'multiple-choice': MultipleChoiceQuestion,
  'free-text': FreeTextQuestion,
  // Other component types would be registered here
};

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const problem = ref(null);
const currentStepIndex = ref(0);
const stepsCompleted = ref({});
const showHints = ref(false);
const feedbackMessage = ref('');
const lastSubmissionCorrect = ref(false);

// Mock problem data - in a real application, this would come from an API
const problemData = {
  'merge-sort': {
    id: 'merge-sort',
    title: 'Merge Sort',
    difficulty: 'Beginner',
    category: 'Sorting',
    estimatedTime: '20 mins',
    description: 'The Merge Sort algorithm is a classic divide-and-conquer algorithm for sorting arrays. It works by recursively dividing the array in half, sorting each half, and then merging the sorted halves back together. Your task is to understand the divide-and-conquer aspects of the Merge Sort algorithm before implementing it.',
    learningObjectives: [
      'Understand how to decompose a sorting problem into smaller subproblems',
      'Identify appropriate base cases for the recursion',
      'Formulate the recurrence relation that describes the algorithm\'s time complexity',
      'Develop correct pseudocode for the Merge Sort algorithm'
    ],
    hints: [
      'Think about what is the smallest array size that you can sort without recursion',
      'Consider how to merge two already sorted arrays efficiently',
      'The recurrence relation should express the time as a function of the input size'
    ]
  }
};

// Mock steps data
const steps = [
  {
    title: 'Problem Decomposition',
    instructions: 'In the first step, you need to identify how the Merge Sort algorithm breaks down the original problem into smaller subproblems.',
    type: 'multiple-choice',
    data: {
      question: 'How does the Merge Sort algorithm decompose the original sorting problem?',
      options: [
        'It selects a pivot element and partitions the array around it',
        'It divides the array in half regardless of the values',
        'It creates buckets based on value ranges',
        'It identifies already sorted subarrays'
      ],
      correctAnswer: 'It divides the array in half regardless of the values'
    }
  },
  {
    title: 'Base Case Identification',
    instructions: 'Now, identify the base case for the Merge Sort recursion. The base case is the simplest instance of the problem that can be solved directly without further recursion.',
    type: 'multiple-choice',
    data: {
      question: 'What is the base case for the Merge Sort algorithm?',
      options: [
        'An array of size 0',
        'An array of size 1',
        'An array of size 2',
        'A sorted array of any size'
      ],
      correctAnswer: 'An array of size 1'
    }
  },
  {
    title: 'Recurrence Relation',
    instructions: 'In this step, identify the recurrence relation that describes the time complexity of the Merge Sort algorithm.',
    type: 'multiple-choice',
    data: {
      question: 'Which recurrence relation correctly describes the time complexity of Merge Sort?',
      options: [
        'T(n) = 2T(n/2) + O(n)',
        'T(n) = T(n/2) + O(1)',
        'T(n) = 2T(n/2) + O(log n)',
        'T(n) = T(n-1) + O(n)'
      ],
      correctAnswer: 'T(n) = 2T(n/2) + O(n)'
    }
  },
  {
    title: 'Pseudocode Translation',
    instructions: 'Now, write pseudocode for the Merge Sort algorithm. Make sure to include both the recursive Merge Sort function and the merge function that combines two sorted arrays.',
    type: 'free-text',
    data: {
      question: 'Write pseudocode for the Merge Sort algorithm, including the merge function:',
      validateFunc: (answer) => {
        // This is a simplified validator for demo purposes
        // In a real application, this would be more sophisticated
        const lowerAnswer = answer.toLowerCase();
        return lowerAnswer.includes('mergesort') && 
               lowerAnswer.includes('merge') && 
               lowerAnswer.includes('if') && 
               (lowerAnswer.includes('length') || lowerAnswer.includes('size')) &&
               lowerAnswer.includes('return');
      }
    }
  }
];

// Computed properties
const currentStep = computed(() => steps[currentStepIndex.value]);

const canProgressToNextStep = computed(() => {
  return stepsCompleted.value[currentStepIndex.value] === true;
});

// Methods
const toggleHints = () => {
  showHints.value = !showHints.value;
};

const handleStepSubmission = (result) => {
  if (result.correct) {
    stepsCompleted.value[currentStepIndex.value] = true;
    feedbackMessage.value = 'Correct! You can proceed to the next step.';
    lastSubmissionCorrect.value = true;
  } else {
    feedbackMessage.value = 'That\'s not quite right. Please try again.';
    lastSubmissionCorrect.value = false;
  }
};

const previousStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--;
    feedbackMessage.value = '';
  }
};

const nextStep = () => {
  if (currentStepIndex.value < steps.length - 1) {
    currentStepIndex.value++;
    feedbackMessage.value = '';
  } else {
    // Last step completed, handle completion
    // In a real app, this would save progress to the backend
    router.push('/problems');
  }
};

// Lifecycle hooks
onMounted(() => {
  const id = route.params.id;
  // In a real app, this would be an API call
  problem.value = problemData[id];
  loading.value = false;
});
</script>