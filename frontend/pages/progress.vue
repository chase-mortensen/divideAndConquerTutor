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
          <div class="text-4xl font-bold mt-2">{{ userStore.completionRate }}%</div>
          <p class="text-sm text-gray-500">{{ userStore.progress.completedProblems.length }} of {{ problemStore.allProblems.length }} problems completed</p>
          <div class="mt-4 w-full bg-gray-200 rounded-full h-2.5">
            <div class="bg-primary h-2.5 rounded-full" :style="{ width: userStore.completionRate + '%' }"></div>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Accuracy</h2>
          <div class="text-4xl font-bold mt-2">{{ userStore.overallAccuracy }}%</div>
          <p class="text-sm text-gray-500">First-attempt correct answers</p>
          <div class="mt-4 w-full bg-gray-200 rounded-full h-2.5">
            <div class="bg-success h-2.5 rounded-full" :style="{ width: userStore.overallAccuracy + '%' }"></div>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Learning Streak</h2>
          <div class="text-4xl font-bold mt-2">{{ learningStreak }} days</div>
          <p class="text-sm text-gray-500">{{ learningStreak > 0 ? 'Keep it going!' : 'Start today!' }}</p>
          <div class="flex justify-center mt-4">
            <div class="flex gap-1">
              <div v-for="day in 7" :key="day"
                class="w-6 h-6 rounded-sm"
                :class="day <= learningStreak ? 'bg-primary' : 'bg-gray-200'">
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
                    'badge-success': problem.status === PROGRESS_STATUS.COMPLETED,
                    'badge-warning': problem.status === PROGRESS_STATUS.IN_PROGRESS,
                    'badge-neutral': problem.status === PROGRESS_STATUS.NOT_STARTED
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
                    {{ problem.status === PROGRESS_STATUS.COMPLETED ? 'Review' : 'Continue' }}
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="card bg-base-100 shadow-xl mb-8">
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

    <!-- Knowledge Model Visualization -->
    <KnowledgeModelDetails v-if="lowestSkill" :initial-skill="lowestSkill" />
  </NuxtLayout>
</template>

<script setup>
import { computed } from 'vue';
import { useProblemStore } from '~/stores/problemStore';
import { useUserStore } from '~/stores/userStore';
import KnowledgeModelDetails from '~/components/ui/KnowledgeModelDetails.vue';
import { PROGRESS_STATUS, STEP_TYPE } from '~/constants';

const problemStore = useProblemStore();
const userStore = useUserStore();

// Format date to relative format (e.g., "3 days ago")
const formatRelativeDate = (dateString) => {
  if (!dateString) return 'Never';

  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
};

// Get all problems and combine with progress data
const progressData = computed(() => {
  const problemsById = {};
  problemStore.allProblems.forEach(problem => {
    problemsById[problem.id] = {
      id: problem.id,
      title: problem.title,
      status: PROGRESS_STATUS.NOT_STARTED,
      attempts: 0,
      accuracy: 0,
      lastAttempt: 'Never'
    };
  });

  // Update completed problems
  userStore.progress.completedProblems.forEach(id => {
    if (problemsById[id]) {
      problemsById[id].status = PROGRESS_STATUS.COMPLETED;
    }
  });

  // Update in-progress problems
  userStore.progress.inProgressProblems.forEach(id => {
    if (problemsById[id]) {
      problemsById[id].status = PROGRESS_STATUS.IN_PROGRESS;
    }
  });

  // Add detailed stats from problemStats
  Object.entries(userStore.progress.problemStats).forEach(([id, stats]) => {
    if (problemsById[id]) {
      problemsById[id].attempts = stats.attempts || 0;
      problemsById[id].accuracy = stats.accuracy || 0;
      problemsById[id].lastAttempt = formatRelativeDate(stats.lastAttempt);
    }
  });

  return Object.values(problemsById);
});

// Get skill breakdown from user store
const skillBreakdown = computed(() => {
  return [
    { name: 'Problem Decomposition', mastery: userStore.progress.skillMastery[STEP_TYPE.DECOMPOSITION] },
    { name: 'Base Case Identification', mastery: userStore.progress.skillMastery[STEP_TYPE.BASE_CASE] },
    { name: 'Recurrence Relations', mastery: userStore.progress.skillMastery[STEP_TYPE.RECURRENCE] },
    { name: 'Pseudocode Translation', mastery: userStore.progress.skillMastery[STEP_TYPE.PSEUDOCODE] }
  ];
});

// Calculate learning streak based on last attempt dates
const learningStreak = computed(() => {
  // Get all last attempt dates
  const attemptDates = Object.values(userStore.progress.problemStats)
    .map(stats => stats.lastAttempt)
    .filter(date => date) // Filter out undefined/null
    .map(date => new Date(date)); // Convert to Date objects

  if (attemptDates.length === 0) return 0;

  // Sort dates in descending order (newest first)
  attemptDates.sort((a, b) => b - a);

  // Check if there's activity today
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to beginning of day

  const mostRecent = new Date(attemptDates[0]);
  mostRecent.setHours(0, 0, 0, 0); // Set to beginning of day

  // If most recent activity is not today or yesterday, streak is 0
  if ((today - mostRecent) / (1000 * 60 * 60 * 24) > 1) {
    return 0;
  }

  // Check how many consecutive days of activity
  let streak = 1; // Start with 1 for today/yesterday
  let currentDay = new Date(mostRecent);

  // Look back up to 6 more days (for a max streak of 7)
  for (let i = 1; i < 7; i++) {
    currentDay.setDate(currentDay.getDate() - 1); // Go back one day

    // Check if there was activity on this day
    const hadActivity = attemptDates.some(date => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === currentDay.getTime();
    });

    if (hadActivity) {
      streak++;
    } else {
      break; // Break the streak
    }
  }

  return streak;
});

// Generate recommendations based on skill mastery
// Get the lowest skill for visualization
const lowestSkill = computed(() => {
  const skills = userStore.progress.skillMastery;
  return Object.entries(skills).reduce(
    (min, [key, value]) => value < min.value ? { key, value } : min,
    { key: 'decomposition', value: 100 }
  ).key;
});

const recommendedAreas = computed(() => {
  const recommendations = [];
  const skills = userStore.progress.skillMastery;

  // Add recommendation for the lowest skill
  const currLowestSkill = lowestSkill.value;

  if (currLowestSkill === 'decomposition') {
    recommendations.push('Practice problem decomposition with more complex problems');
  } else if (currLowestSkill === 'base-case') {
    recommendations.push('Work on identifying efficient base cases for your algorithms');
  } else if (currLowestSkill === 'recurrence') {
    recommendations.push('Focus on formulating recurrence relations more clearly');
  } else if (currLowestSkill === 'pseudocode') {
    recommendations.push('Improve your pseudocode writing skills with more practice');
  }

  // Add recommendation for next problem
  const recommendedProblems = userStore.recommendedProblems;
  if (recommendedProblems.length > 0) {
    const nextProblem = problemStore.problemById(recommendedProblems[0]);
    if (nextProblem) {
      recommendations.push(`Try the "${nextProblem.title}" problem next to improve your skills`);
    }
  }

  // Add generic recommendation if we have fewer than 2
  if (recommendations.length < 2) {
    recommendations.push('Complete more problems to get more personalized recommendations');
  }

  return recommendations;
});
</script>