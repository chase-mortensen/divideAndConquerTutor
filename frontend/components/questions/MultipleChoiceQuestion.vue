<template>
  <div>
    <div class="mb-4">
      <div class="font-medium mb-2">{{ data.question }}</div>
      <div v-for="(option, index) in data.options" :key="index" class="form-control">
        <label class="label cursor-pointer justify-start gap-4">
          <input
            v-if="isMultiSelect"
            type="checkbox"
            class="checkbox"
            :value="option"
            v-model="selectedOptions"
          />
          <input
            v-else
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
    <button @click="submitAnswer" class="btn btn-sm btn-primary" :disabled="!canSubmit">
      Submit Answer
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['submit']);
const selectedOption = ref(null);
const selectedOptions = ref([]);

// Check if this is a multi-select question
const isMultiSelect = computed(() => {
  return Array.isArray(props.data.correctAnswer);
});

// Determine if the submit button should be enabled
const canSubmit = computed(() => {
  if (isMultiSelect.value) {
    return selectedOptions.value.length > 0;
  } else {
    return selectedOption.value !== null;
  }
});

const submitAnswer = () => {
  let isCorrect = false;
  let answer;

  if (isMultiSelect.value) {
    answer = selectedOptions.value;
    
    // For multi-select, compare arrays (all options must match and be in any order)
    if (selectedOptions.value.length === props.data.correctAnswer.length) {
      // Check that all selected options are in the correct answer set
      isCorrect = selectedOptions.value.every(option => 
        props.data.correctAnswer.includes(option)
      );
    }
  } else {
    answer = selectedOption.value;
    isCorrect = selectedOption.value === props.data.correctAnswer;
  }
  
  emit('submit', {
    answer: answer,
    correct: isCorrect
  });
};
</script>

<style lang="css" scoped>
.label-text {
  white-space: wrap;
}
</style>