<template>
  <div class="flex justify-between">
    <button 
      @click="$emit('previous')" 
      class="btn" 
      :disabled="isFirstStep"
    >
      Previous
    </button>
    
    <button 
      @click="$emit('next')" 
      class="btn btn-primary" 
      :disabled="!canProgress"
    >
      {{ isLastStep ? 'Finish' : 'Next' }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  isFirstStep: {
    type: Boolean,
    default: false
  },
  isLastStep: {
    type: Boolean,
    default: false
  },
  canProgress: {
    type: Boolean,
    default: false
  }
});

defineEmits(['previous', 'next']);
</script>