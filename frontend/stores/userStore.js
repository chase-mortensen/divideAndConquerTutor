import { defineStore } from 'pinia';
import BKTModel from './bktModel';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    progress: {
      completedProblems: ['binary-search', 'matrix-multiplication'],
      inProgressProblems: ['maximum-subarray'],
      problemStats: {
        'binary-search': {
          attempts: 2,
          accuracy: 90,
          lastAttempt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          difficulty: 'Beginner',
          stepData: {
            'decomposition': { correct: true, attempts: 1, correctCount: 1, incorrectCount: 0 },
            'base-case': { correct: true, attempts: 1, correctCount: 1, incorrectCount: 0 },
            'recurrence': { correct: true, attempts: 2, correctCount: 1, incorrectCount: 1 },
            'pseudocode': { correct: true, attempts: 1, correctCount: 1, incorrectCount: 0 }
          }
        },
        'maximum-subarray': {
          attempts: 1,
          accuracy: 75,
          lastAttempt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          difficulty: 'Intermediate',
          stepData: {
            'decomposition': { correct: true, attempts: 1, correctCount: 1, incorrectCount: 0 },
            'base-case': { correct: true, attempts: 2, correctCount: 1, incorrectCount: 1 },
            'recurrence': { correct: false, attempts: 1, correctCount: 0, incorrectCount: 1 },
            'pseudocode': { correct: false, attempts: 0, correctCount: 0, incorrectCount: 0 }
          }
        },
        'matrix-multiplication': {
          attempts: 3,
          accuracy: 85,
          lastAttempt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          difficulty: 'Advanced',
          stepData: {
            'decomposition': { correct: true, attempts: 1, correctCount: 1, incorrectCount: 0 },
            'base-case': { correct: true, attempts: 2, correctCount: 1, incorrectCount: 1 },
            'recurrence': { correct: true, attempts: 3, correctCount: 1, incorrectCount: 2 },
            'pseudocode': { correct: true, attempts: 2, correctCount: 1, incorrectCount: 1 }
          }
        }
      },
      skillMastery: {
        'decomposition': 85,
        'base-case': 70,
        'recurrence': 60,
        'pseudocode': 75
      },
      // BKT knowledge estimates for each skill
      knowledgeEstimates: {
        'decomposition': 0.85,
        'base-case': 0.70,
        'recurrence': 0.60,
        'pseudocode': 0.75
      }
    }
  }),
  
  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    completionRate: (state) => {
      const totalProblems = 6; // Hard-coded for this prototype
      return Math.round((state.progress.completedProblems.length / totalProblems) * 100);
    },
    overallAccuracy: (state) => {
      const stats = state.progress.problemStats;
      const accuracyValues = Object.values(stats).map(s => s.accuracy);
      if (accuracyValues.length === 0) return 0;
      return Math.round(accuracyValues.reduce((a, b) => a + b, 0) / accuracyValues.length);
    },
    recommendedProblems: (state) => {
      // Simple recommendation logic based on completed problems and skill mastery
      // In a real app, this would be more sophisticated
      const completed = new Set(state.progress.completedProblems);
      const inProgress = new Set(state.progress.inProgressProblems);
      
      // Recommend problems that are not completed and not in progress
      const allProblems = ['binary-search', 'merge-sort', 'quick-sort', 'maximum-subarray', 'closest-pair', 'matrix-multiplication'];
      return allProblems
        .filter(p => !completed.has(p) && !inProgress.has(p))
        .slice(0, 2); // Return top 2 recommendations
    },
    
    // Get the next step prediction for a specific problem and skill
    predictNextAttempt: (state) => (problemId, stepId) => {
      // If no stats exist yet, return a default prediction
      if (!state.progress.problemStats[problemId]) {
        return {
          probabilityCorrect: 0.5, // 50% chance by default
          confidence: 'medium'
        };
      }
      
      const problemStats = state.progress.problemStats[problemId];
      const difficulty = problemStats.difficulty || 'Intermediate';
      
      // Get appropriate BKT model for this skill type
      const bktParams = BKTModel.getParametersForSkill(stepId, difficulty.toLowerCase());
      const bktModel = new BKTModel(bktParams);
      
      // Get the current knowledge estimate for this skill
      const knowledgeEstimate = state.progress.knowledgeEstimates[stepId] || bktModel.p_L0;
      
      // Predict performance using the model
      const probabilityCorrect = bktModel.predictPerformance(knowledgeEstimate);
      
      // Determine confidence level based on amount of data
      let confidence = 'low';
      if (problemStats.stepData[stepId]) {
        const attempts = problemStats.stepData[stepId].attempts || 0;
        if (attempts > 5) {
          confidence = 'high';
        } else if (attempts > 2) {
          confidence = 'medium';
        }
      }
      
      return {
        probabilityCorrect: Math.round(probabilityCorrect * 100) / 100,
        knowledgeEstimate: Math.round(knowledgeEstimate * 100) / 100,
        confidence
      };
    }
  },
  
  actions: {
    login(email, password) {
      // In a real app, this would make an API call
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email === 'demo@example.com' && password === 'password') {
            this.user = {
              id: '1',
              name: 'Demo User',
              email: 'demo@example.com'
            };
            this.isAuthenticated = true;
            resolve(true);
          } else {
            reject(new Error('Invalid credentials'));
          }
        }, 1000);
      });
    },
    
    logout() {
      this.user = null;
      this.isAuthenticated = false;
    },
    
    updateProblemProgress(problemId, stepId, result, problemDifficulty = 'Intermediate') {
      // Ensure problem stats exist
      if (!this.progress.problemStats[problemId]) {
        this.progress.problemStats[problemId] = {
          attempts: 0,
          accuracy: 0,
          lastAttempt: new Date().toISOString(),
          difficulty: problemDifficulty,
          stepData: {}
        };
      }
      
      // Ensure step data exists
      if (!this.progress.problemStats[problemId].stepData[stepId]) {
        this.progress.problemStats[problemId].stepData[stepId] = {
          correct: false,
          attempts: 0,
          correctCount: 0,
          incorrectCount: 0
        };
      }
      
      // Update step data
      const stepData = this.progress.problemStats[problemId].stepData[stepId];
      stepData.attempts++;
      
      // Track this attempt as correct or incorrect (for BKT)
      if (result) {
        stepData.correct = true;
        stepData.correctCount = (stepData.correctCount || 0) + 1;
      } else {
        stepData.incorrectCount = (stepData.incorrectCount || 0) + 1;
      }
      
      // Update problem stats
      this.progress.problemStats[problemId].lastAttempt = new Date().toISOString();
      
      // Calculate new accuracy
      const steps = Object.values(this.progress.problemStats[problemId].stepData);
      const correctSteps = steps.filter(s => s.correct).length;
      this.progress.problemStats[problemId].accuracy = Math.round((correctSteps / steps.length) * 100);
      
      // Check if all steps are correct to mark as completed
      const allCorrect = steps.every(s => s.correct);
      
      if (allCorrect && !this.progress.completedProblems.includes(problemId)) {
        // Move from inProgress to completed
        this.progress.inProgressProblems = this.progress.inProgressProblems.filter(id => id !== problemId);
        this.progress.completedProblems.push(problemId);
      } else if (!allCorrect && !this.progress.inProgressProblems.includes(problemId) && 
                 !this.progress.completedProblems.includes(problemId)) {
        // Add to inProgress if not already there
        this.progress.inProgressProblems.push(problemId);
      }
      
      // Update skill mastery using Bayesian Knowledge Tracing
      this._updateSkillMastery();
    },
    
    _updateSkillMastery() {
      // Implement Bayesian Knowledge Tracing for more accurate skill mastery estimates
      
      // Define the skill categories
      const skills = ['decomposition', 'base-case', 'recurrence', 'pseudocode'];
      
      // For each skill, update mastery using BKT
      for (const skill of skills) {
        // Aggregate performance data across all problems
        const performanceHistory = {
          correct: 0,
          incorrect: 0
        };
        
        // Collect difficulty levels to get weighted parameters
        const difficultyCounter = {
          'Beginner': 0,
          'Intermediate': 0,
          'Advanced': 0
        };
        
        // Aggregate data from all problems
        for (const [problemId, problemStats] of Object.entries(this.progress.problemStats)) {
          // Count difficulties for weighting
          if (problemStats.difficulty) {
            difficultyCounter[problemStats.difficulty]++;
          }
          
          // Collect performance data for this skill
          if (problemStats.stepData[skill]) {
            const stepData = problemStats.stepData[skill];
            performanceHistory.correct += stepData.correctCount || 0;
            performanceHistory.incorrect += stepData.incorrectCount || 0;
          }
        }
        
        // Determine predominant difficulty level for parameter selection
        let predominantDifficulty = 'Intermediate'; // Default
        let maxCount = 0;
        for (const [difficulty, count] of Object.entries(difficultyCounter)) {
          if (count > maxCount) {
            maxCount = count;
            predominantDifficulty = difficulty;
          }
        }
        
        // Get BKT parameters appropriate for this skill and difficulty
        const bktParams = BKTModel.getParametersForSkill(skill, predominantDifficulty.toLowerCase());
        const bktModel = new BKTModel(bktParams);
        
        // Calculate knowledge estimate using BKT model
        const knowledgeEstimate = bktModel.calculateMastery(performanceHistory) / 100;
        
        // Save the raw knowledge estimate
        this.progress.knowledgeEstimates[skill] = knowledgeEstimate;
        
        // Update the mastery percentage (visible to user)
        this.progress.skillMastery[skill] = Math.round(knowledgeEstimate * 100);
      }
    }
  }
});