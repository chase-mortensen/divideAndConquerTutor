<template>
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
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['submit']);
const answer = ref('');

const submitAnswer = () => {
  // Check for required keywords if validationKeywords exists
  let isCorrect = true;
  
  if (props.data.validationKeywords && Array.isArray(props.data.validationKeywords)) {
    const lowerAnswer = answer.value.toLowerCase();
    isCorrect = props.data.validationKeywords.every(keyword => 
      lowerAnswer.includes(keyword.toLowerCase())
    );
  }

  emit('submit', {
    answer: answer.value,
    correct: isCorrect
  });
};
</script>