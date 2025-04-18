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
  
  // Get knowledge and other BKT metrics
  const knowledge = knowledgePrediction.value.knowledgeEstimate || 0.5;
  const probability = knowledgePrediction.value.probabilityCorrect || 0.5;
  const attemptsNeeded = knowledgePrediction.value.attemptsToMastery || 5;
  
  // Show hints in these situations
  
  // Case 1: Low knowledge students always get help
  if (knowledge < 0.4) return true;
  
  // Case 2: Medium knowledge students get help after some struggles
  if (knowledge < 0.7 && props.attemptCount > 0) {
    // More likely to show hints if predicted success is low
    if (probability < 0.6) return true;
    if (props.attemptCount > 1) return true; // Always after multiple attempts
  }
  
  // Case 3: Higher knowledge students only get help after several attempts
  if (knowledge < 0.9) {
    // If they're close to mastery, be more conservative with hints
    const mastering = attemptsNeeded <= 2;
    
    if (mastering) {
      // Only show hints after many attempts if they're close to mastery
      return props.attemptCount >= 3;
    } else {
      // Otherwise show after fewer attempts
      return props.attemptCount >= 2;
    }
  }
  
  // Case 4: Very high mastery students rarely get hints unless explicitly requested
  return props.attemptCount > 3; // Only after many attempts
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
  
  // Get detailed BKT metrics for personalized hint selection
  const knowledge = knowledgePrediction.value.knowledgeEstimate || 0.5;
  const successProb = knowledgePrediction.value.probabilityCorrect || 0.6;
  const attemptsToMastery = knowledgePrediction.value.attemptsToMastery || 5;
  const attempts = props.attemptCount;
  const confidence = knowledgePrediction.value.confidence || 'medium';
  
  // Create a hint selection strategy based on these factors
  let hintLevel = 0;
  
  // Calculate a "struggle score" that combines multiple factors
  // Higher struggle = more explicit hints
  let struggleScore = 0;
  
  // Factor 1: Low knowledge increases struggle score
  struggleScore += (1 - knowledge) * 2.5; // 0-2.5 points for knowledge
  
  // Factor 2: Multiple attempts increases struggle score
  struggleScore += Math.min(2, attempts * 0.5); // 0-2 points for attempts
  
  // Factor 3: Low success probability increases struggle score
  struggleScore += (1 - successProb) * 1.5; // 0-1.5 points for success probability
  
  // Factor 4: Many attempts to mastery increases struggle score
  struggleScore += Math.min(1, attemptsToMastery / 10); // 0-1 points for mastery distance
  
  // Factor 5: If last attempt was incorrect, add to struggle score
  if (!props.lastAttemptCorrect) {
    struggleScore += 1;
  }
  
  // Calculate hint level based on struggle score (0-7 scale)
  if (struggleScore >= 5) {
    // High struggle - give most detailed hint available
    hintLevel = props.hints.length - 1;
  } else if (struggleScore >= 3) {
    // Medium struggle - give intermediate hint
    hintLevel = Math.floor((props.hints.length - 1) * 0.66);
  } else if (struggleScore >= 1.5) {
    // Lower struggle - give basic hint
    hintLevel = Math.floor((props.hints.length - 1) * 0.33);
  } else {
    // Minimal struggle - give minimal hint
    hintLevel = 0;
  }
  
  // Ensure valid hint level
  currentHintLevel.value = Math.min(hintLevel, props.hints.length - 1);
  
  // Show action suggestion for struggling students or when confidence is low
  if (struggleScore > 3 || confidence === 'low' || attempts > 2) {
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