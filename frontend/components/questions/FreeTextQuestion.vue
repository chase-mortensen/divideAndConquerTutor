<template>
  <div>
    <div class="mb-4">
      <div class="font-medium mb-2">{{ data.question }}</div>
      
      <!-- For pseudocode questions, use styled text area with dark mode and monospace font -->
      <div v-if="isPseudocodeQuestion" class="relative border rounded overflow-hidden" style="min-height: 300px;">
        <div class="absolute left-0 top-0 px-3 py-2 w-12 bottom-0 bg-neutral text-neutral-content text-right font-mono text-sm border-r" aria-hidden="true">
          <div v-for="i in lineCount" :key="i" class="line-number">{{ i }}</div>
        </div>
        <textarea 
          ref="codeEditor"
          v-model="answer" 
          class="w-full h-full min-h-[300px] px-1 py-2 pl-14 font-mono bg-neutral text-neutral-content resize-y"
          placeholder="Enter your pseudocode here..."
          style="tab-size: 2; -moz-tab-size: 2;"
          @input="updateLineCount"
          @keydown.tab.prevent="handleTab"
        ></textarea>
      </div>
      
      <!-- Regular text area for non-code questions -->
      <textarea 
        v-else
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
import { ref, computed, onMounted } from 'vue';
import { STEP_TYPE } from '~/constants';
import { analyzePseudocode } from '~/stores/pseudocodeFeedback';
import { useProblemStore } from '~/stores/problemStore';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['submit']);
const answer = ref('');
const codeEditor = ref(null);
const lineCount = ref(1);
const problemStore = useProblemStore();

// Check if this is a pseudocode question
const isPseudocodeQuestion = computed(() => {
  // Determine if this is a pseudocode question by looking at context
  // Check if the question text contains pseudocode or the parent step type is pseudocode
  return props.data.isPseudocode || 
         props.data.question?.toLowerCase().includes('pseudocode') ||
         props.data.stepType === STEP_TYPE.PSEUDOCODE;
});

// Update line numbers in the editor
const updateLineCount = () => {
  const lines = answer.value.split('\n').length;
  lineCount.value = Math.max(1, lines);
};

// Handle tab key for indentation
const handleTab = (e) => {
  // Insert two spaces where the cursor is
  const start = e.target.selectionStart;
  const end = e.target.selectionEnd;
  
  // Insert tab (2 spaces)
  const newValue = answer.value.substring(0, start) + '  ' + answer.value.substring(end);
  answer.value = newValue;
  
  // Move cursor after the inserted spaces
  setTimeout(() => {
    e.target.selectionStart = e.target.selectionEnd = start + 2;
  }, 0);
};

// Initialize with default content for pseudocode editor
onMounted(() => {
  if (isPseudocodeQuestion.value && !answer.value) {
    answer.value = '// Write your pseudocode here\n\n';
    updateLineCount();
  }
});

const submitAnswer = () => {
  // Default validation (for non-pseudocode questions)
  let isCorrect = true;
  let feedbackDetails = [];
  
  if (isPseudocodeQuestion.value) {
    // Use the pseudocode analyzer for detailed feedback 
    const currentProblemId = problemStore.currentProblem?.id;
    if (currentProblemId) {
      const analysis = analyzePseudocode(currentProblemId, answer.value);
      isCorrect = analysis.isCorrect;
      feedbackDetails = analysis.detailedFeedback || [];
    } else {
      // Fall back to keyword validation if problem ID not available
      if (props.data.validationKeywords && Array.isArray(props.data.validationKeywords)) {
        const lowerAnswer = answer.value.toLowerCase();
        isCorrect = props.data.validationKeywords.every(keyword => 
          lowerAnswer.includes(keyword.toLowerCase())
        );
      }
    }
  } else if (props.data.validationKeywords && Array.isArray(props.data.validationKeywords)) {
    // Basic keyword validation for non-pseudocode questions
    const lowerAnswer = answer.value.toLowerCase();
    isCorrect = props.data.validationKeywords.every(keyword => 
      lowerAnswer.includes(keyword.toLowerCase())
    );
  }

  emit('submit', {
    answer: answer.value,
    correct: isCorrect,
    feedbackDetails
  });
};
</script>

<style scoped>
/* Pseudocode editor styles */
.line-number {
  user-select: none;
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.9em;
}

textarea {
  outline: none;
  border: none;
}
</style>