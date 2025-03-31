<template>
  <NuxtLayout name="default">
    <div class="hero min-h-[60vh] bg-base-200 rounded-lg">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">Divide-and-Conquer Tutor</h1>
          <p class="py-6">
            Master algorithm design through guided practice. Learn to decompose problems, identify base cases, formulate recurrence relations, and write pseudocode.
          </p>
          <NuxtLink to="/problems" class="btn btn-primary">Get Started</NuxtLink>
        </div>
      </div>
    </div>

    <div class="mt-12">
      <h2 class="text-3xl font-bold text-center mb-8">How It Works</h2>
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">1. Problem Decomposition</h3>
            <p>Learn to break complex problems into smaller, more manageable subproblems.</p>
          </div>
        </div>
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">2. Base Case Identification</h3>
            <p>Identify the simplest instances of a problem that can be solved directly.</p>
          </div>
        </div>
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">3. Recurrence Relations</h3>
            <p>Formulate mathematical equations that define how subproblem solutions combine.</p>
          </div>
        </div>
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">4. Pseudocode Translation</h3>
            <p>Transform your solution approach into structured pseudocode before implementation.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-12">
      <h2 class="text-3xl font-bold text-center mb-8">Featured Problems</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="problem in featuredProblems" :key="problem.id" class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <div class="flex justify-between items-start">
              <h3 class="card-title">{{ problem.title }}</h3>
              <div class="badge" :class="{
                'badge-primary': problem.difficulty === 'Beginner',
                'badge-secondary': problem.difficulty === 'Intermediate',
                'badge-accent': problem.difficulty === 'Advanced'
              }">{{ problem.difficulty }}</div>
            </div>
            <p>{{ problem.description }}</p>
            <div class="card-actions justify-end mt-4">
              <NuxtLink :to="`/problems/${problem.id}`" class="btn btn-primary btn-sm">Solve Now</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
const featuredProblems = [
  {
    id: 'merge-sort',
    title: 'Merge Sort',
    difficulty: 'Beginner',
    description: 'Implement the merge sort algorithm that sorts an array using the divide-and-conquer approach.'
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Beginner',
    description: 'Implement a binary search algorithm to find a target element in a sorted array.'
  },
  {
    id: 'maximum-subarray',
    title: 'Maximum Subarray',
    difficulty: 'Intermediate',
    description: 'Find the contiguous subarray that has the largest sum within a given array.'
  },
  {
    id: 'closest-pair',
    title: 'Closest Pair of Points',
    difficulty: 'Advanced',
    description: 'Find the closest pair of points in a set of points in a 2D plane.'
  },
  {
    id: 'matrix-multiplication',
    title: 'Strassen\'s Matrix Multiplication',
    difficulty: 'Advanced',
    description: 'Implement Strassen\'s algorithm for multiplying matrices more efficiently.'
  },
  {
    id: 'quick-sort',
    title: 'Quick Sort',
    difficulty: 'Intermediate',
    description: 'Implement the quick sort algorithm using a pivot-based approach.'
  }
];
</script>