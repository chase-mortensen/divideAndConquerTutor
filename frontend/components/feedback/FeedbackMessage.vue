<template>
  <div v-if="message" class="alert mb-4 flex flex-col items-start" :class="{
    'alert-success': isCorrect,
    'alert-error': !isCorrect && !isHint,
    'alert-warning': isHint
  }">
    <div class="flex items-start">
      <span v-if="isCorrect" class="mr-2">✓</span>
      <span v-else-if="isHint" class="mr-2">💡</span>
      <span v-else class="mr-2">✗</span>
      <span>{{ message }}</span>
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

defineEmits(['requestHint']);
</script>