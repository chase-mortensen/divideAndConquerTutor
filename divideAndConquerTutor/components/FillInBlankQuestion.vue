<template>
  <div>
    <div class="mb-4">
      <div class="font-medium mb-2">{{ data.question }}</div>
      
      <div class="whitespace-pre-wrap">
        <template v-for="(part, index) in parsedQuestion" :key="index">
          <template v-if="part.type === 'text'">
            {{ part.content }}
          </template>
          <input 
            v-else
            v-model="userAnswers[part.index]" 
            type="text" 
            class="input input-bordered input-sm mx-1 w-32"
            :placeholder="`Answer ${part.index + 1}`"
          />
        </template>
      </div>
    </div>
    <button @click="submitAnswer" class="btn btn-sm btn-primary" :disabled="!isAnswerComplete">
      Submit Answer
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['submit']);
const userAnswers = ref([]);
const parsedQuestion = ref([]);

// Parse the question text to extract placeholders like [blank]
onMounted(() => {
  parseQuestionText();
  // Initialize userAnswers array with empty strings
  userAnswers.value = Array(props.data.blanks.length).fill('');
});

const parseQuestionText = () => {
  const regex = /\[blank\]/g;
  const text = props.data.questionText;
  let lastIndex = 0;
  let match;
  let blankIndex = 0;
  
  while ((match = regex.exec(text)) !== null) {
    // Add text before the blank
    if (match.index > lastIndex) {
      parsedQuestion.value.push({
        type: 'text',
        content: text.substring(lastIndex, match.index)
      });
    }
    
    // Add the blank
    parsedQuestion.value.push({
      type: 'blank',
      index: blankIndex
    });
    
    blankIndex++;
    lastIndex = regex.lastIndex;
  }
  
  // Add any remaining text
  if (lastIndex < text.length) {
    parsedQuestion.value.push({
      type: 'text',
      content: text.substring(lastIndex)
    });
  }
};

const isAnswerComplete = computed(() => {
  return userAnswers.value.every(answer => answer.trim() !== '');
});

const submitAnswer = () => {
  // Check each answer against the expected answers (case insensitive)
  const results = userAnswers.value.map((answer, index) => {
    const correctAnswers = props.data.blanks[index];
    // Convert to lowercase for case-insensitive comparison
    const normalizedAnswer = answer.toLowerCase().trim();
    
    // Check if the answer matches any of the acceptable answers
    return correctAnswers.some(correct => 
      correct.toLowerCase().trim() === normalizedAnswer
    );
  });
  
  // All answers must be correct
  const isAllCorrect = results.every(result => result === true);
  
  emit('submit', {
    answer: userAnswers.value,
    correct: isAllCorrect,
    partialResults: results // This can be used for more specific feedback
  });
};
</script>