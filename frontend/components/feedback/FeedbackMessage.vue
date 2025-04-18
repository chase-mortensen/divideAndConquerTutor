<template>
  <div v-if="message || (detailedFeedback && detailedFeedback.length > 0)" class="alert mb-4 flex flex-col items-start" :class="{
    'alert-success': isCorrect,
    'alert-error': !isCorrect && !isHint,
    'alert-warning': isHint
  }">
    <div class="flex items-start">
      <span v-if="isCorrect" class="mr-2">✓</span>
      <span v-else-if="isHint" class="mr-2">💡</span>
      <span v-else class="mr-2">✗</span>
      <span>{{ message || "Your pseudocode needs some improvements:" }}</span>
    </div>
    
    <div v-if="detailedFeedback && detailedFeedback.length > 0" class="mt-3 w-full">
      <ul class="list-disc list-inside">
        <li v-for="(item, index) in detailedFeedback" :key="index" class="mt-1">
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';

const props = defineProps({
  message: {
    type: String,
    default: ''
  },
  isCorrect: {
    type: Boolean,
    default: false
  },
  isHint: {
    type: Boolean,
    default: false
  },
  detailedFeedback: {
    type: Array,
    default: () => []
  },
  showHintButton: {
    type: Boolean,
    default: true
  }
});

// For debugging
onMounted(() => {
  console.log('FeedbackMessage mounted with:', {
    message: props.message,
    detailedFeedback: props.detailedFeedback,
    isCorrect: props.isCorrect,
    isHint: props.isHint
  });
});

// Watch for changes in props
watch(() => props.detailedFeedback, (newFeedback) => {
  console.log('detailedFeedback changed:', newFeedback);
}, { deep: true });

watch(() => props.message, (newMessage) => {
  console.log('message changed:', newMessage);
});

defineEmits(['requestHint']);
</script>