<template>
  <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
    <div class="card-body">
      <div class="flex justify-between items-start">
        <ProblemHeader :problem="problem" />
      </div>
      <p>{{ problem.description }}</p>
      <div class="card-actions justify-between items-center mt-4">
        <div class="flex items-center gap-1">
          <span v-if="completed" class="text-success text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Completed
          </span>
          <span v-else-if="inProgress" class="text-warning text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            In Progress
          </span>
        </div>
        <NuxtLink :to="`/problems/${problem.id}`" class="btn btn-primary btn-sm">
          {{ completed ? 'Review' : (inProgress ? 'Continue' : 'Start') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '~/stores/userStore';
import ProblemHeader from '~/components/ProblemHeader.vue';

const props = defineProps({
  problem: {
    type: Object,
    required: true
  }
});

// If the problem already has 'completed' and 'inProgress' properties, use those
// Otherwise, compute them from the userStore
const completed = computed(() => {
  if ('completed' in props.problem) {
    return props.problem.completed;
  }
  
  const userStore = useUserStore();
  return userStore.progress.completedProblems.includes(props.problem.id);
});

const inProgress = computed(() => {
  if ('inProgress' in props.problem) {
    return props.problem.inProgress;
  }
  
  const userStore = useUserStore();
  return userStore.progress.inProgressProblems.includes(props.problem.id);
});
</script>