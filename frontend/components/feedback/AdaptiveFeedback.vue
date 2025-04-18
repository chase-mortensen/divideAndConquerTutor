<template>
  <div>
    <div v-if="showAdaptiveHint" class="alert alert-info my-4 flex flex-col items-start">
      <div class="flex items-center">
        <span class="mr-2">💡</span>
        <span class="font-medium">Adaptive Hint:</span>
      </div>
      <p class="mt-2">{{ adaptiveHint }}</p>
      
      <div v-if="showActionSuggestion" class="mt-2 text-sm italic">
        <span>{{ actionSuggestion }}</span>
      </div>
      
      <div class="mt-2 self-end">
        <button @click="showAdaptiveHint = false" class="btn btn-xs btn-ghost">
          Dismiss
        </button>
        <button v-if="hasMoreHints" @click="provideNextHint" class="btn btn-xs btn-primary ml-2">
          More Help
        </button>
      </div>
    </div>
    
    <div v-if="!showAdaptiveHint && canShowHint" class="flex justify-end mt-2">
      <button @click="provideHint" class="btn btn-sm btn-outline">
        <span class="mr-1">💡</span>
        Need help with this step?
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '~/stores/userStore';
import { suggestNextAction } from '~/stores/feedbackRules';

const props = defineProps({
  problemId: {
    type: String,
    required: true
  },
  stepId: {
    type: String,
    required: true
  },
  stepType: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    default: 'Intermediate'
  },
  hints: {
    type: Array,
    default: () => []
  },
  showHint: {
    type: Boolean,
    default: false
  },
  questionType: {
    type: String,
    default: 'multiple-choice'
  },
  lastAttemptCorrect: {
    type: Boolean,
    default: true
  },
  attemptCount: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['hint-provided']);

const userStore = useUserStore();
const showAdaptiveHint = ref(false);
const currentHintLevel = ref(0);
const showActionSuggestion = ref(false);

// Get the BKT knowledge prediction for this step
const knowledgePrediction = computed(() => {
  return userStore.predictNextAttempt(props.problemId, props.stepType);
});

// Determine if we should show hints at all based on knowledge level
const canShowHint = computed(() => {
  // Always allow if user has explicitly toggled hints
  if (props.showHint) return true;
  
  // If knowledge estimate is high, don't offer hints
  const knowledge = knowledgePrediction.value.knowledgeEstimate || 0.5;
  
  // Show hints based on knowledge level and attempt count
  if (knowledge < 0.4) return true; // Always show for low knowledge
  if (knowledge < 0.7 && props.attemptCount > 1) return true; // Show after struggles
  if (knowledge < 0.9 && props.attemptCount > 2) return true; // Show after multiple attempts
  
  return false; // Don't show for high mastery students
});

// Are there more hints available
const hasMoreHints = computed(() => {
  return currentHintLevel.value < props.hints.length - 1;
});

// Get the personalized action suggestion based on performance
const actionSuggestion = computed(() => {
  // Get performance history from user store
  const performanceHistory = userStore.progress.problemStats[props.problemId]?.stepData[props.stepId];
  const knowledgeEstimate = knowledgePrediction.value.knowledgeEstimate || 0.5;
  
  return suggestNextAction(performanceHistory, knowledgeEstimate);
});

// Get hint based on current knowledge level and context
const adaptiveHint = computed(() => {
  if (!props.hints || props.hints.length === 0) {
    // Fallback hint based on step type if no hints provided
    const fallbackHints = {
      'decomposition': "Try breaking the problem into smaller, similar subproblems.",
      'baseCase': "Think about the simplest version of this problem that can be solved directly.",
      'recurrence': "Consider how the solution to the original problem relates to solutions of the subproblems.",
      'pseudocode': "Make sure your algorithm includes the divide, conquer, and combine steps."
    };
    
    return fallbackHints[props.stepType] || 
      "Try breaking the problem down into smaller parts and solving each part separately.";
  }
  
  // Get appropriate hint based on knowledge level and difficulty
  return props.hints[currentHintLevel.value];
});

// Provide a hint based on knowledge level and attempt count
const provideHint = () => {
  // Reset action suggestion visibility
  showActionSuggestion.value = false;
  
  // Set starting hint level based on knowledge estimate and attempts
  // Lower knowledge or more attempts = more explicit hint
  const knowledge = knowledgePrediction.value.knowledgeEstimate || 0.5;
  const attempts = props.attemptCount;
  
  if (knowledge < 0.3 || attempts > 3) {
    // For very low knowledge or many attempts, start with more explicit hint
    currentHintLevel.value = Math.min(2, props.hints.length - 1);
  } else if (knowledge < 0.5 || attempts > 1) {
    // For moderate knowledge or some attempts, start with intermediate hint
    currentHintLevel.value = Math.min(1, props.hints.length - 1);
  } else {
    // Otherwise start with first hint
    currentHintLevel.value = 0;
  }
  
  // Show action suggestion for struggling students
  if (attempts > 2 || knowledge < 0.4) {
    showActionSuggestion.value = true;
  }
  
  showAdaptiveHint.value = true;
  emit('hint-provided', adaptiveHint.value);
};

// Provide next level hint (more explicit)
const provideNextHint = () => {
  if (currentHintLevel.value < props.hints.length - 1) {
    currentHintLevel.value++;
    
    // Show action suggestion on the last hint
    if (currentHintLevel.value === props.hints.length - 1) {
      showActionSuggestion.value = true;
    }
    
    emit('hint-provided', adaptiveHint.value);
  }
};
</script>