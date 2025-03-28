import { defineStore } from 'pinia';

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
          stepData: {
            'decomposition': { correct: true, attempts: 1 },
            'base-case': { correct: true, attempts: 1 },
            'recurrence': { correct: true, attempts: 2 },
            'pseudocode': { correct: true, attempts: 1 }
          }
        },
        'maximum-subarray': {
          attempts: 1,
          accuracy: 75,
          lastAttempt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          stepData: {
            'decomposition': { correct: true, attempts: 1 },
            'base-case': { correct: true, attempts: 2 },
            'recurrence': { correct: false, attempts: 1 },
            'pseudocode': { correct: false, attempts: 0 }
          }
        },
        'matrix-multiplication': {
          attempts: 3,
          accuracy: 85,
          lastAttempt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          stepData: {
            'decomposition': { correct: true, attempts: 1 },
            'base-case': { correct: true, attempts: 2 },
            'recurrence': { correct: true, attempts: 3 },
            'pseudocode': { correct: true, attempts: 2 }
          }
        }
      },
      skillMastery: {
        'decomposition': 85,
        'base-case': 70,
        'recurrence': 60,
        'pseudocode': 75
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
    
    updateProblemProgress(problemId, stepId, result) {
      // Ensure problem stats exist
      if (!this.progress.problemStats[problemId]) {
        this.progress.problemStats[problemId] = {
          attempts: 0,
          accuracy: 0,
          lastAttempt: new Date().toISOString(),
          stepData: {}
        };
      }
      
      // Ensure step data exists
      if (!this.progress.problemStats[problemId].stepData[stepId]) {
        this.progress.problemStats[problemId].stepData[stepId] = {
          correct: false,
          attempts: 0
        };
      }
      
      // Update step data
      const stepData = this.progress.problemStats[problemId].stepData[stepId];
      stepData.attempts++;
      
      if (result) {
        stepData.correct = true;
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
      
      // Update skill mastery
      this._updateSkillMastery();
    },
    
    _updateSkillMastery() {
      // In a real app, this would implement Bayesian Knowledge Tracing
      // For this prototype, we use a simple averaging approach
      
      // Map stepIds to skill categories
      const skillMap = {
        'decomposition': ['decomposition'],
        'base-case': ['base-case'],
        'recurrence': ['recurrence'],
        'pseudocode': ['pseudocode']
      };
      
      // For each skill category, calculate mastery based on steps completed
      for (const [skill, steps] of Object.entries(skillMap)) {
        let totalCorrect = 0;
        let totalAttempts = 0;
        
        // Aggregate data from all problems
        for (const problemStats of Object.values(this.progress.problemStats)) {
          for (const stepId of steps) {
            if (problemStats.stepData[stepId]) {
              const stepData = problemStats.stepData[stepId];
              if (stepData.correct) totalCorrect++;
              if (stepData.attempts > 0) totalAttempts++;
            }
          }
        }
        
        // Calculate mastery percentage
        if (totalAttempts > 0) {
          this.progress.skillMastery[skill] = Math.round((totalCorrect / totalAttempts) * 100);
        }
      }
    }
  }
});