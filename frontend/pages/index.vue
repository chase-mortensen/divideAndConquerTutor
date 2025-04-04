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
                'badge-primary': problem.difficulty === DIFFICULTY.BEGINNER,
                'badge-secondary': problem.difficulty === DIFFICULTY.INTERMEDIATE,
                'badge-accent': problem.difficulty === DIFFICULTY.ADVANCED
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
import { useProblemStore } from '~/stores/problemStore';
import { DIFFICULTY } from '~/constants';

const problemStore = useProblemStore();
const featuredProblems = problemStore.featuredProblems;
</script>