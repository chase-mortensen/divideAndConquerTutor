<template>
  <NuxtLayout name="default">
    <div class="pb-4 border-b mb-6">
      <h1 class="text-3xl font-bold">Problem Library</h1>
      <p class="text-gray-600 mt-2">Select a problem to start your learning journey</p>
    </div>

    <div class="mb-6">
      <div class="flex flex-wrap gap-2">
        <button 
          @click="filterDifficulty = ''" 
          class="btn btn-sm" 
          :class="{'btn-primary': filterDifficulty === ''}">
          All
        </button>
        <button 
          @click="filterDifficulty = 'Beginner'" 
          class="btn btn-sm" 
          :class="{'btn-primary': filterDifficulty === 'Beginner'}">
          Beginner
        </button>
        <button 
          @click="filterDifficulty = 'Intermediate'" 
          class="btn btn-sm" 
          :class="{'btn-primary': filterDifficulty === 'Intermediate'}">
          Intermediate
        </button>
        <button 
          @click="filterDifficulty = 'Advanced'" 
          class="btn btn-sm" 
          :class="{'btn-primary': filterDifficulty === 'Advanced'}">
          Advanced
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="problem in filteredProblems" 
        :key="problem.id" 
        class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
      >
        <div class="card-body">
          <div class="flex justify-between items-start">
            <h2 class="card-title">{{ problem.title }}</h2>
            <div class="badge" :class="{
              'badge-primary': problem.difficulty === 'Beginner',
              'badge-secondary': problem.difficulty === 'Intermediate',
              'badge-accent': problem.difficulty === 'Advanced'
            }">{{ problem.difficulty }}</div>
          </div>
          <p>{{ problem.description }}</p>
          <div class="mt-2 flex items-center gap-2">
            <div class="badge badge-outline">{{ problem.category }}</div>
            <div class="text-xs">Time: {{ problem.estimatedTime }}</div>
          </div>
          <div class="card-actions justify-between items-center mt-4">
            <div class="flex items-center gap-1">
              <span v-if="problem.completed" class="text-success text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Completed
              </span>
              <span v-else-if="problem.inProgress" class="text-warning text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                In Progress
              </span>
            </div>
            <NuxtLink :to="`/problems/${problem.id}`" class="btn btn-primary btn-sm">
              {{ problem.completed ? 'Review' : (problem.inProgress ? 'Continue' : 'Start') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useProblemStore } from '~/stores/problemStore';
import { useUserStore } from '~/stores/userStore';

const filterDifficulty = ref('');
const problemStore = useProblemStore();
const userStore = useUserStore();

// Get base problems from the store
const baseProblems = computed(() => problemStore.allProblems);

// Enhance the problems with progress information from user store
const problems = computed(() => {
  return baseProblems.value.map(problem => {
    const isCompleted = userStore.progress.completedProblems.includes(problem.id);
    const isInProgress = userStore.progress.inProgressProblems.includes(problem.id);
    
    return {
      ...problem,
      completed: isCompleted,
      inProgress: isInProgress
    };
  });
});

const filteredProblems = computed(() => {
  if (!filterDifficulty.value) return problems.value;
  return problems.value.filter(problem => problem.difficulty === filterDifficulty.value);
});
</script>