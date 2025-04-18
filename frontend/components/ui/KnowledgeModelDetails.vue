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
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
          
          <div class="border rounded-lg p-3 bg-base-200">
            <div class="text-sm font-medium mb-2">Predictions</div>
            <div class="flex flex-col gap-2">
              <div class="flex justify-between">
                <div class="text-xs text-gray-500">Attempts to Mastery</div>
                <div class="font-semibold">{{ attemptsToMastery }}</div>
              </div>
              <div class="flex justify-between">
                <div class="text-xs text-gray-500">Recommended Difficulty</div>
                <div class="font-semibold capitalize">{{ recommendedDifficulty }}</div>
              </div>
              <div class="flex justify-between">
                <div class="text-xs text-gray-500">Retention After 7 Days</div>
                <div class="font-semibold">{{ retentionEstimate }}%</div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="hasLearningCurve" class="border rounded-lg p-3 bg-base-200 mb-4">
          <div class="text-sm font-medium mb-2">Learning Curve</div>
          <div class="h-32 relative">
            <!-- Simple line chart visualization -->
            <div class="absolute bottom-0 left-0 w-full h-full flex items-end">
              <div v-for="(point, index) in learningCurvePoints" 
                   :key="index" 
                   class="bg-primary w-3 rounded-t-sm mx-0.5"
                   :style="{ height: `${point.value * 100}%` }"
                   :title="`${new Date(point.timestamp).toLocaleDateString()}: ${Math.round(point.value * 100)}%`">
              </div>
            </div>
            <!-- Horizontal grid lines -->
            <div class="absolute bottom-1/4 left-0 w-full h-px bg-gray-300"></div>
            <div class="absolute bottom-2/4 left-0 w-full h-px bg-gray-300"></div>
            <div class="absolute bottom-3/4 left-0 w-full h-px bg-gray-300"></div>
            <!-- Labels -->
            <div class="absolute bottom-[100%] left-0 text-xs text-gray-500">Knowledge</div>
            <div class="absolute bottom-0 right-[100%] text-xs text-gray-500">Time</div>
          </div>
        </div>
        
        <div class="border rounded-lg p-3 bg-base-200">
          <div class="text-sm font-medium mb-2">BKT Model Parameters</div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span class="text-gray-500">Initial Knowledge (p_L0):</span>
              <span class="ml-1">{{ initialKnowledge }}</span>
            </div>
            <div>
              <span class="text-gray-500">Learning Rate (p_T):</span>
              <span class="ml-1">{{ learningRate }}</span>
            </div>
            <div>
              <span class="text-gray-500">Guess Probability (p_G):</span>
              <span class="ml-1">{{ guessRate }}</span>
            </div>
            <div>
              <span class="text-gray-500">Slip Probability (p_S):</span>
              <span class="ml-1">{{ slipRate }}</span>
            </div>
          </div>
          <div class="mt-2 text-xs text-gray-500">
            <p>BKT parameters are automatically calibrated based on your performance data.</p>
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
import BKTModel from '~/stores/bktModel';

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

// Create BKT model for the selected skill
const bktModel = computed(() => {
  const params = BKTModel.getParametersForSkill(
    selectedSkill.value, 
    getMostCommonDifficulty()
  );
  return new BKTModel(params);
});

// Extract model parameters for display
const initialKnowledge = computed(() => (bktModel.value.p_L0 * 100).toFixed(0) + '%');
const learningRate = computed(() => (bktModel.value.p_T * 100).toFixed(0) + '%');
const guessRate = computed(() => (bktModel.value.p_G * 100).toFixed(0) + '%');
const slipRate = computed(() => (bktModel.value.p_S * 100).toFixed(0) + '%');

// Get the most commonly attempted difficulty level for this skill
const getMostCommonDifficulty = () => {
  const difficulties = {
    'beginner': 0,
    'intermediate': 0,
    'advanced': 0
  };
  
  // Count problem difficulties where this skill has been practiced
  for (const [problemId, stats] of Object.entries(userStore.progress.problemStats)) {
    if (stats.stepData[selectedSkill.value]) {
      const difficulty = stats.difficulty?.toLowerCase() || 'intermediate';
      difficulties[difficulty] = (difficulties[difficulty] || 0) + 1;
    }
  }
  
  // Find the most common difficulty
  let maxCount = 0;
  let result = 'intermediate';
  
  for (const [difficulty, count] of Object.entries(difficulties)) {
    if (count > maxCount) {
      maxCount = count;
      result = difficulty;
    }
  }
  
  return result;
};

// Calculate attempts to mastery
const attemptsToMastery = computed(() => {
  const knowledge = skillData.value.knowledgeEstimate;
  if (knowledge >= 0.95) return 0;
  
  return bktModel.value.attemptsToMastery(knowledge);
});

// Get recommended difficulty level
const recommendedDifficulty = computed(() => {
  return bktModel.value.recommendDifficulty(skillData.value.knowledgeEstimate);
});

// Estimate knowledge retention after 7 days
const retentionEstimate = computed(() => {
  const knowledge = skillData.value.knowledgeEstimate;
  const retainedKnowledge = bktModel.value.applyKnowledgeDecay(knowledge, 7);
  return Math.round(retainedKnowledge * 100);
});

// Build learning curve data (if available)
const learningCurvePoints = computed(() => {
  const points = [];
  const now = Date.now();
  const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
  
  // Collect all attempts for this skill type
  for (const problemStats of Object.values(userStore.progress.problemStats)) {
    if (problemStats.stepData[selectedSkill.value]) {
      const stepData = problemStats.stepData[selectedSkill.value];
      
      if (stepData.attemptHistory) {
        // Add each point from the attempt history
        for (const attempt of stepData.attemptHistory) {
          if (attempt.timestamp > oneWeekAgo) {
            points.push({
              timestamp: attempt.timestamp,
              correct: attempt.correct,
              value: 0 // Will be calculated next
            });
          }
        }
      }
    }
  }
  
  // Sort by timestamp
  points.sort((a, b) => a.timestamp - b.timestamp);
  
  // Calculate running knowledge estimate
  if (points.length > 0) {
    let knowledge = bktModel.value.p_L0;
    
    for (let i = 0; i < points.length; i++) {
      // Apply time decay between points if significant time has passed
      if (i > 0) {
        const elapsedMs = points[i].timestamp - points[i-1].timestamp;
        const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24);
        
        if (elapsedDays > 0.5) { // Only decay after 12+ hours
          knowledge = bktModel.value.applyKnowledgeDecay(knowledge, elapsedDays);
        }
      }
      
      // Update knowledge based on correctness
      knowledge = bktModel.value.updateKnowledge(knowledge, points[i].correct);
      
      // Save the knowledge value at this point
      points[i].value = knowledge;
    }
  }
  
  return points;
});

// Determine if there's enough data for a learning curve
const hasLearningCurve = computed(() => {
  return learningCurvePoints.value.length >= 3;
});
</script>