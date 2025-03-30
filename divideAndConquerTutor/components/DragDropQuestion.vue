<template>
  <div>
    <div class="mb-4">
      <div class="font-medium mb-2">{{ data.question }}</div>
      
      <!-- Available items to drag -->
      <div class="flex flex-wrap gap-2 mb-4">
        <div v-for="(item, index) in remainingItems" 
          :key="'item-' + index"
          @dragstart="dragStart($event, item)"
          @dragend="dragEnd"
          draggable="true"
          class="badge badge-lg p-3 cursor-move bg-base-200 hover:bg-base-300">
          {{ item }}
        </div>
      </div>
      
      <!-- Drop zones -->
      <div class="border border-base-300 rounded-lg p-4 bg-base-100">
        <div 
          v-for="(answer, index) in userOrder" 
          :key="'slot-' + index"
          @dragover.prevent
          @drop="drop($event, index)"
          class="flex items-center border-b border-base-200 last:border-0 p-2 min-h-12">
          <div class="mr-3 font-medium w-8">{{ index + 1 }}.</div>
          <div 
            v-if="answer" 
            class="badge badge-lg p-3 bg-primary text-primary-content">
            {{ answer }}
          </div>
          <div 
            v-else 
            class="w-full h-10 border-2 border-dashed border-base-300 rounded-md flex items-center justify-center text-base-300">
            Drop item here
          </div>
        </div>
      </div>
    </div>
    
    <div class="flex justify-between">
      <button @click="resetOrder" class="btn btn-sm btn-outline">
        Reset Order
      </button>
      <button @click="submitAnswer" class="btn btn-sm btn-primary" :disabled="!isOrderComplete">
        Submit Answer
      </button>
    </div>
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
const userOrder = ref([]);
const draggedItem = ref(null);

// Initialize with empty slots
onMounted(() => {
  userOrder.value = Array(props.data.correctOrder.length).fill(null);
});

// Compute remaining items that haven't been placed yet
const remainingItems = computed(() => {
  const placedItems = new Set(userOrder.value.filter(item => item !== null));
  return props.data.items.filter(item => !placedItems.has(item));
});

const isOrderComplete = computed(() => {
  return userOrder.value.every(item => item !== null);
});

// Drag and drop handlers
const dragStart = (event, item) => {
  draggedItem.value = item;
  event.dataTransfer.effectAllowed = 'move';
};

const dragEnd = () => {
  draggedItem.value = null;
};

const drop = (event, index) => {
  if (draggedItem.value) {
    // Check if we're moving an item already in the order
    const existingIndex = userOrder.value.findIndex(item => item === draggedItem.value);
    
    if (existingIndex !== -1) {
      // Remove from old position
      userOrder.value[existingIndex] = null;
    }
    
    // Place item in the new position
    userOrder.value[index] = draggedItem.value;
    draggedItem.value = null;
  }
};

const resetOrder = () => {
  userOrder.value = Array(props.data.correctOrder.length).fill(null);
};

const submitAnswer = () => {
  // Compare user order with correct order
  const isCorrect = props.data.correctOrder.every(
    (item, index) => item === userOrder.value[index]
  );
  
  emit('submit', {
    answer: userOrder.value,
    correct: isCorrect
  });
};
</script>

<style scoped>
[draggable="true"] {
  user-select: none;
  -webkit-user-drag: element;
}
</style>