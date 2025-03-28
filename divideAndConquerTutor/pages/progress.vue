<template>
  <NuxtLayout name="default">
    <div class="pb-4 border-b mb-6">
      <h1 class="text-3xl font-bold">My Progress</h1>
      <p class="text-gray-600 mt-2">Track your learning journey and achievements</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Completion Rate</h2>
          <div class="text-4xl font-bold mt-2">33%</div>
          <p class="text-sm text-gray-500">2 of 6 problems completed</p>
          <div class="mt-4 w-full bg-gray-200 rounded-full h-2.5">
            <div class="bg-primary h-2.5 rounded-full" style="width: 33%"></div>
          </div>
        </div>
      </div>
      
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Accuracy</h2>
          <div class="text-4xl font-bold mt-2">78%</div>
          <p class="text-sm text-gray-500">First-attempt correct answers</p>
          <div class="mt-4 w-full bg-gray-200 rounded-full h-2.5">
            <div class="bg-success h-2.5 rounded-full" style="width: 78%"></div>
          </div>
        </div>
      </div>
      
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Learning Streak</h2>
          <div class="text-4xl font-bold mt-2">3 days</div>
          <p class="text-sm text-gray-500">Keep it going!</p>
          <div class="flex justify-center mt-4">
            <div class="flex gap-1">
              <div v-for="day in 7" :key="day" 
                class="w-6 h-6 rounded-sm" 
                :class="day <= 3 ? 'bg-primary' : 'bg-gray-200'">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card bg-base-100 shadow-xl mb-8">
      <div class="card-body">
        <h2 class="card-title mb-4">Problem Mastery</h2>
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Problem</th>
                <th>Status</th>
                <th>Attempts</th>
                <th>Accuracy</th>
                <th>Last Attempt</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="problem in progressData" :key="problem.id">
                <td>{{ problem.title }}</td>
                <td>
                  <div class="badge" :class="{
                    'badge-success': problem.status === 'Completed',
                    'badge-warning': problem.status === 'In Progress',
                    'badge-neutral': problem.status === 'Not Started'
                  }">{{ problem.status }}</div>
                </td>
                <td>{{ problem.attempts }}</td>
                <td>
                  <div class="flex items-center">
                    <div class="w-full bg-gray-200 rounded-full h-1.5 mr-2">
                      <div class="bg-primary h-1.5 rounded-full" :style="{ width: problem.accuracy + '%' }"></div>
                    </div>
                    <span>{{ problem.accuracy }}%</span>
                  </div>
                </td>
                <td>{{ problem.lastAttempt }}</td>
                <td>
                  <NuxtLink :to="`/problems/${problem.id}`" class="btn btn-xs btn-primary">
                    {{ problem.status === 'Completed' ? 'Review' : 'Continue' }}
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title mb-4">Skill Breakdown</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-semibold mb-3">Problem Solving Steps</h3>
            <div class="space-y-4">
              <div v-for="(skill, index) in skillBreakdown" :key="index">
                <div class="flex justify-between mb-1">
                  <span>{{ skill.name }}</span>
                  <span>{{ skill.mastery }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-primary h-2 rounded-full" :style="{ width: skill.mastery + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="font-semibold mb-3">Recommended Focus Areas</h3>
            <ul class="space-y-2">
              <li v-for="(area, index) in recommendedAreas" :key="index" class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2 mt-0.5 text-primary">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ area }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
const progressData = [
  {
    id: 'binary-search',
    title: 'Binary Search',
    status: 'Completed',
    attempts: 2,
    accuracy: 90,
    lastAttempt: '3 days ago'
  },
  {
    id: 'maximum-subarray',
    title: 'Maximum Subarray',
    status: 'In Progress',
    attempts: 1,
    accuracy: 75,
    lastAttempt: '1 day ago'
  },
  {
    id: 'merge-sort',
    title: 'Merge Sort',
    status: 'Not Started',
    attempts: 0,
    accuracy: 0,
    lastAttempt: 'Never'
  },
  {
    id: 'quick-sort',
    title: 'Quick Sort',
    status: 'Not Started',
    attempts: 0,
    accuracy: 0,
    lastAttempt: 'Never'
  },
  {
    id: 'closest-pair',
    title: 'Closest Pair of Points',
    status: 'Not Started',
    attempts: 0,
    accuracy: 0,
    lastAttempt: 'Never'
  },
  {
    id: 'matrix-multiplication',
    title: 'Strassen\'s Matrix Multiplication',
    status: 'Completed',
    attempts: 3,
    accuracy: 85,
    lastAttempt: '5 days ago'
  }
];

const skillBreakdown = [
  { name: 'Problem Decomposition', mastery: 85 },
  { name: 'Base Case Identification', mastery: 70 },
  { name: 'Recurrence Relations', mastery: 60 },
  { name: 'Pseudocode Translation', mastery: 75 }
];

const recommendedAreas = [
  'Practice formulating recurrence relations in more complex problems',
  'Work on identifying efficient base cases for your algorithms',
  'Try the "Quick Sort" problem to improve your divide-and-conquer skills'
];
</script>