<template>
  <div>
    <div v-if="showAdaptiveHint" class="alert alert-info my-4 flex flex-col items-start">
      <div class="flex items-center">
        <span class="mr-2">💡</span>
        <span class="font-medium">Adaptive Hint:</span>
      </div>
      <p class="mt-2">{{ adaptiveHint }}</p>
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
  }
});

const emit = defineEmits(['hint-provided']);

const userStore = useUserStore();
const showAdaptiveHint = ref(false);
const currentHintLevel = ref(0);

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
  return knowledge < 0.9; // Only show for students with less than 90% mastery
});

// Are there more hints available
const hasMoreHints = computed(() => {
  return currentHintLevel.value < props.hints.length - 1;
});

// Get hint based on current knowledge level
const adaptiveHint = computed(() => {
  if (!props.hints || props.hints.length === 0) {
    return "Try breaking the problem down into smaller parts and solving each part separately.";
  }
  
  // Select hint based on current hint level
  return props.hints[currentHintLevel.value];
});

// Provide a hint based on knowledge level
const provideHint = () => {
  // Set starting hint level based on knowledge estimate
  // Lower knowledge = more explicit hint
  const knowledge = knowledgePrediction.value.knowledgeEstimate || 0.5;
  
  if (knowledge < 0.4) {
    // For very low knowledge, start with more explicit hint
    currentHintLevel.value = Math.min(1, props.hints.length - 1);
  } else {
    // Otherwise start with first hint
    currentHintLevel.value = 0;
  }
  
  showAdaptiveHint.value = true;
  emit('hint-provided', adaptiveHint.value);
};

// Provide next level hint (more explicit)
const provideNextHint = () => {
  if (currentHintLevel.value < props.hints.length - 1) {
    currentHintLevel.value++;
    emit('hint-provided', adaptiveHint.value);
  }
};
</script>