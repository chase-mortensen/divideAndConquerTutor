<template>
  <div v-if="message" class="alert mb-4" :class="{
    'alert-success': isCorrect,
    'alert-error': !isCorrect && !isHint,
    'alert-warning': isHint
  }">
    <div>
      <span v-if="isCorrect">✓</span>
      <span v-else-if="isHint">💡</span>
      <span v-else>✗</span>
      {{ message }}
    </div>
    
    <div v-if="detailedFeedback && detailedFeedback.length > 0" class="mt-2">
      <ul class="list-disc list-inside">
        <li v-for="(item, index) in detailedFeedback" :key="index" class="mt-1">
          {{ item }}
        </li>
      </ul>
    </div>
    
    <div v-if="showHintButton && !isCorrect" class="mt-2">
      <button @click="$emit('requestHint')" class="btn btn-xs btn-outline">
        Need a hint?
      </button>
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