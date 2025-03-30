<template>
  <div>
    <div class="flex items-start">
      <h2 class="text-md font-semibold">{{ problem.title }}</h2>
      <div class="badge ml-2" :class="{
        'badge-primary': problem.difficulty === 'Beginner',
        'badge-secondary': problem.difficulty === 'Intermediate',
        'badge-accent': problem.difficulty === 'Advanced'
      }">{{ problem.difficulty }}</div>
    </div>
    <div class="mt-2 flex items-center gap-2">
      <div class="badge badge-outline">{{ problem.category }}</div>
      <div class="text-xs">Est. Time: {{ problem.estimatedTime }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  problem: {
    type: Object,
    required: true
  }
});
</script>