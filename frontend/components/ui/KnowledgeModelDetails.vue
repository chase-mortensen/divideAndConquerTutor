<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">Bayesian Knowledge Model</h2>
      <p class="text-sm mb-4">
        Your knowledge is tracked using Bayesian Knowledge Tracing, a statistical model that 
        estimates your understanding of each skill and predicts your future performance.
      </p>
      
      <div v-if="selectedSkill">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold text-lg">{{ formatSkillName(selectedSkill) }}</h3>
          <div class="badge badge-lg" :class="knowledgeLevelClass">
            {{ knowledgeLevel }}
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="border rounded-lg p-3 bg-base-200">
            <div class="text-sm font-medium mb-1">Knowledge Estimate</div>
            <div class="flex items-end">
              <span class="text-2xl font-bold">{{ (skillData.knowledgeEstimate * 100).toFixed(0) }}%</span>
              <span class="text-xs ml-2 mb-1 text-gray-500">confidence</span>
            </div>
          </div>
          
          <div class="border rounded-lg p-3 bg-base-200">
            <div class="text-sm font-medium mb-1">Predicted Success</div>
            <div class="flex items-end">
              <span class="text-2xl font-bold">{{ (predictedPerformance.probabilityCorrect * 100).toFixed(0) }}%</span>
              <span class="text-xs ml-2 mb-1 text-gray-500">{{ predictedPerformance.confidence }} confidence</span>
            </div>
          </div>
        </div>
        
        <div class="mb-4">
          <div class="text-sm font-medium mb-2">Learning Progress</div>
          <div class="flex items-center justify-between">
            <div class="text-xs text-gray-500">Novice</div>
            <div class="text-xs text-gray-500">Expert</div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-4 mt-1 relative">
            <!-- Background progress -->
            <div class="bg-primary h-4 rounded-full" 
                 :style="{ width: (skillData.knowledgeEstimate * 100) + '%' }"></div>
            
            <!-- Mastery threshold marker -->
            <div class="absolute h-8 w-0.5 bg-gray-500 top-[-8px]" 
                 style="left: 95%; transform: translateX(-50%);">
              <div class="text-xs text-gray-500 absolute top-[-20px] transform translate-x-[-50%]">
                Mastery
              </div>
            </div>
          </div>
        </div>
        
        <div class="border rounded-lg p-3 bg-base-200">
          <div class="text-sm font-medium mb-2">Performance Statistics</div>
          <div class="flex justify-between">
            <div>
              <div class="text-xs text-gray-500">Correct Answers</div>
              <div class="font-semibold">{{ performanceStats.correct }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-500">Attempts</div>
              <div class="font-semibold">{{ performanceStats.total }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-500">Success Rate</div>
              <div class="font-semibold">{{ performanceStats.rate }}%</div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-4">
        <p>Select a skill to view detailed knowledge model information</p>
      </div>
      
      <div class="mt-3">
        <div class="text-sm font-medium mb-2">Select Skill</div>
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="skill in skills" 
            :key="skill"
            @click="selectedSkill = skill"
            class="btn btn-sm" 
            :class="{ 'btn-primary': selectedSkill === skill }">
            {{ formatSkillName(skill) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '~/stores/userStore';

const props = defineProps({
  initialSkill: {
    type: String,
    default: 'decomposition'
  }
});

const userStore = useUserStore();
const selectedSkill = ref(props.initialSkill);

// List of all skills
const skills = ['decomposition', 'base-case', 'recurrence', 'pseudocode'];

// Format skill name for display
const formatSkillName = (skill) => {
  const names = {
    'decomposition': 'Problem Decomposition',
    'base-case': 'Base Case Identification',
    'recurrence': 'Recurrence Relations',
    'pseudocode': 'Pseudocode Translation'
  };
  return names[skill] || skill;
};

// Get data for the selected skill
const skillData = computed(() => {
  const knowledgeEstimate = userStore.progress.knowledgeEstimates[selectedSkill.value] || 0.3;
  return {
    knowledgeEstimate,
    mastery: userStore.progress.skillMastery[selectedSkill.value] || 0
  };
});

// Categorize knowledge level
const knowledgeLevel = computed(() => {
  const estimate = skillData.value.knowledgeEstimate;
  if (estimate >= 0.95) return 'Expert';
  if (estimate >= 0.8) return 'Advanced';
  if (estimate >= 0.6) return 'Intermediate';
  if (estimate >= 0.4) return 'Basic';
  return 'Novice';
});

// Classes for knowledge level badge
const knowledgeLevelClass = computed(() => {
  const level = knowledgeLevel.value;
  if (level === 'Expert') return 'badge-accent';
  if (level === 'Advanced') return 'badge-primary';
  if (level === 'Intermediate') return 'badge-secondary';
  if (level === 'Basic') return 'badge-info';
  return 'badge-neutral';
});

// Get a prediction for the next attempt on this skill (using the first unfinished problem as example)
const predictedPerformance = computed(() => {
  // Find an in-progress problem to use for prediction
  if (userStore.progress.inProgressProblems.length > 0) {
    const problemId = userStore.progress.inProgressProblems[0];
    return userStore.predictNextAttempt(problemId, selectedSkill.value);
  }
  
  // Or just use any problem if none in progress
  if (Object.keys(userStore.progress.problemStats).length > 0) {
    const problemId = Object.keys(userStore.progress.problemStats)[0];
    return userStore.predictNextAttempt(problemId, selectedSkill.value);
  }
  
  // Default if no problems found
  return {
    probabilityCorrect: skillData.value.knowledgeEstimate,
    confidence: 'low'
  };
});

// Performance statistics for this skill
const performanceStats = computed(() => {
  let correct = 0;
  let total = 0;
  
  // Aggregate data across all problems
  for (const problemStats of Object.values(userStore.progress.problemStats)) {
    if (problemStats.stepData[selectedSkill.value]) {
      const stepData = problemStats.stepData[selectedSkill.value];
      correct += stepData.correctCount || 0;
      total += (stepData.correctCount || 0) + (stepData.incorrectCount || 0);
    }
  }
  
  const rate = total > 0 ? Math.round((correct / total) * 100) : 0;
  
  return {
    correct,
    total,
    rate
  };
});
</script>