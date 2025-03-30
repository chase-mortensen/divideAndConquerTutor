<template>
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
const selectedOption = ref(null);

const submitAnswer = () => {
  emit('submit', {
    answer: selectedOption.value,
    correct: selectedOption.value === props.data.correctAnswer
  });
};
</script>