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
      // Enhanced recommendation logic using BKT model
      const completed = new Set(state.progress.completedProblems);
      const inProgress = new Set(state.progress.inProgressProblems);
      
      // Get all incomplete problems
      const allProblems = ['binary-search', 'merge-sort', 'quick-sort', 'maximum-subarray', 'closest-pair', 'matrix-multiplication'];
      const incompleteProblems = allProblems.filter(p => !completed.has(p));
      
      // If there are in-progress problems, prioritize those first
      if (inProgress.size > 0) {
        return Array.from(inProgress).slice(0, 2);
      }
      
      // Get user's knowledge estimates for all skills
      const skillEstimates = state.progress.knowledgeEstimates;
      
      // Calculate average knowledge level (0-1)
      const skills = Object.keys(skillEstimates);
      const avgKnowledge = skills.length > 0
        ? skills.reduce((sum, skill) => sum + (skillEstimates[skill] || 0), 0) / skills.length
        : 0.3; // Default if no skills data yet
      
      // Determine appropriate difficulty level based on knowledge
      const recommendedDifficulty = getRecommendedDifficulty(avgKnowledge);
      
      // Map of problem IDs to their difficulties
      const problemDifficulties = {
        'binary-search': 'beginner',
        'merge-sort': 'beginner',
        'quick-sort': 'intermediate',
        'maximum-subarray': 'intermediate',
        'closest-pair': 'advanced',
        'matrix-multiplication': 'advanced'
      };
      
      // Filter and rank problems
      const rankedProblems = incompleteProblems
        .filter(p => !inProgress.has(p))
        .map(problemId => {
          // Calculate a score based on match to recommended difficulty
          const difficulty = problemDifficulties[problemId] || 'intermediate';
          const difficultyScore = getDifficultyMatchScore(difficulty, recommendedDifficulty);
          
          // Calculate a recency score (prefer problems not attempted recently)
          const recencyScore = getRecencyScore(state.progress.problemStats[problemId]);
          
          // Calculate overall score
          const totalScore = (difficultyScore * 0.7) + (recencyScore * 0.3);
          
          return {
            problemId,
            difficulty,
            score: totalScore
          };
        })
        .sort((a, b) => b.score - a.score) // Sort by score (descending)
        .map(item => item.problemId); // Return just the IDs
      
      return rankedProblems.slice(0, 2); // Return top 2 recommendations
      
      // Helper function to get recommended difficulty level
      function getRecommendedDifficulty(knowledgeLevel) {
        if (knowledgeLevel < 0.4) return 'beginner';
        if (knowledgeLevel < 0.75) return 'intermediate';
        return 'advanced';
      }
      
      // Helper function to score difficulty match
      function getDifficultyMatchScore(problemDifficulty, recommendedDifficulty) {
        // Exact match gets highest score
        if (problemDifficulty === recommendedDifficulty) return 1.0;
        
        // Adjacent difficulty levels get medium score
        if (
          (problemDifficulty === 'beginner' && recommendedDifficulty === 'intermediate') ||
          (problemDifficulty === 'intermediate' && recommendedDifficulty === 'beginner') ||
          (problemDifficulty === 'intermediate' && recommendedDifficulty === 'advanced') ||
          (problemDifficulty === 'advanced' && recommendedDifficulty === 'intermediate')
        ) {
          return 0.7;
        }
        
        // Distant difficulty levels get lowest score
        return 0.3;
      }
      
      // Helper function to calculate recency score (higher score = less recently attempted)
      function getRecencyScore(problemStats) {
        if (!problemStats || !problemStats.lastAttempt) return 1.0;
        
        const lastAttemptDate = new Date(problemStats.lastAttempt);
        const now = new Date();
        const daysSinceLastAttempt = (now - lastAttemptDate) / (1000 * 60 * 60 * 24);
        
        // Scale from 0 to 1, where 1 means "never attempted or very old attempt"
        return Math.min(1.0, daysSinceLastAttempt / 14); // Max score after 2 weeks
      }
    },
    
    // Get the next step prediction for a specific problem and skill
    predictNextAttempt: (state) => (problemId, stepId) => {
      // If no stats exist yet, return a default prediction
      if (!state.progress.problemStats[problemId]) {
        return {
          probabilityCorrect: 0.5, // 50% chance by default
          confidence: 'medium',
          knowledgeEstimate: 0.3 // Default prior
        };
      }
      
      const problemStats = state.progress.problemStats[problemId];
      const difficulty = problemStats.difficulty || 'Intermediate';
      
      // Get appropriate BKT model for this skill type
      const bktParams = BKTModel.getParametersForSkill(stepId, difficulty.toLowerCase());
      const bktModel = new BKTModel(bktParams);
      
      // Get the current knowledge estimate for this skill
      const knowledgeEstimate = state.progress.knowledgeEstimates[stepId] || bktModel.p_L0;
      
      // Check if we need to apply knowledge decay
      let adjustedKnowledge = knowledgeEstimate;
      
      // Apply knowledge decay if it's been more than a day since the last attempt
      const stepData = problemStats.stepData[stepId];
      if (stepData && stepData.attemptHistory && stepData.attemptHistory.length > 0) {
        // Get the timestamp of the most recent attempt
        const timestamps = stepData.attemptHistory.map(a => a.timestamp);
        const mostRecentTimestamp = Math.max(...timestamps);
        
        // Calculate days since last attempt
        const now = Date.now();
        const daysSinceLastAttempt = (now - mostRecentTimestamp) / (1000 * 60 * 60 * 24);
        
        // Apply decay if it's been more than a day
        if (daysSinceLastAttempt > 1) {
          adjustedKnowledge = bktModel.applyKnowledgeDecay(
            knowledgeEstimate, 
            daysSinceLastAttempt
          );
        }
      }
      
      // Predict performance using the model with potentially time-decayed knowledge
      const probabilityCorrect = bktModel.predictPerformance(adjustedKnowledge);
      
      // Determine confidence level based on amount of data
      let confidence = 'low';
      if (stepData) {
        const attempts = stepData.attempts || 0;
        if (attempts > 5) {
          confidence = 'high';
        } else if (attempts > 2) {
          confidence = 'medium';
        }
      }
      
      // Calculate attempts needed to reach mastery
      const attemptsToMastery = bktModel.attemptsToMastery(adjustedKnowledge);
      
      // Get recommended next difficulty level
      const recommendedDifficulty = bktModel.recommendDifficulty(adjustedKnowledge);
      
      return {
        probabilityCorrect: Math.round(probabilityCorrect * 100) / 100,
        knowledgeEstimate: Math.round(adjustedKnowledge * 100) / 100,
        originalKnowledge: Math.round(knowledgeEstimate * 100) / 100,
        confidence,
        attemptsToMastery,
        recommendedDifficulty,
        // Include model parameters for debugging/transparency
        modelParams: {
          p_L0: Math.round(bktModel.p_L0 * 100) / 100,
          p_T: Math.round(bktModel.p_T * 100) / 100,
          p_G: Math.round(bktModel.p_G * 100) / 100,
          p_S: Math.round(bktModel.p_S * 100) / 100
        }
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
          incorrectCount: 0,
          attemptHistory: []
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
      
      // Record time-ordered attempt for sequence-based BKT
      if (!stepData.attemptHistory) {
        stepData.attemptHistory = [];
      }
      
      // Add this attempt to history with timestamp
      stepData.attemptHistory.push({
        correct: result,
        timestamp: Date.now(),
        difficulty: problemDifficulty.toLowerCase()
      });
      
      // Update problem stats
      this.progress.problemStats[problemId].lastAttempt = new Date().toISOString();
      this.progress.problemStats[problemId].attempts = 
        (this.progress.problemStats[problemId].attempts || 0) + 1;
      
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
        
        // Track problem-specific sequences for sequential BKT updates
        const problemSequences = {};
        
        // Aggregate data from all problems
        for (const [problemId, problemStats] of Object.entries(this.progress.problemStats)) {
          // Count difficulties for weighting
          if (problemStats.difficulty) {
            difficultyCounter[problemStats.difficulty]++;
          }
          
          // Collect performance data for this skill
          if (problemStats.stepData[skill]) {
            const stepData = problemStats.stepData[skill];
            
            // Add to aggregate counts
            performanceHistory.correct += stepData.correctCount || 0;
            performanceHistory.incorrect += stepData.incorrectCount || 0;
            
            // Store the sequence of attempts for this problem
            if (stepData.attemptHistory) {
              problemSequences[problemId] = stepData.attemptHistory;
            }
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
        
        // Calculate knowledge estimate using both methods
        
        // Method 1: Simple aggregation (current method)
        let knowledgeEstimate = bktModel.calculateMastery(performanceHistory) / 100;
        
        // Method 2: Sequential update using temporal data (if available)
        if (Object.keys(problemSequences).length > 0) {
          // Start with prior probability
          let p_Ln = bktModel.p_L0;
          
          // Create a flat list of all attempts across problems, sorted by timestamp
          const allAttempts = [];
          
          for (const [problemId, attemptHistory] of Object.entries(problemSequences)) {
            const problemDifficulty = this.progress.problemStats[problemId]?.difficulty?.toLowerCase() || 'intermediate';
            
            // Get problem-specific BKT params
            const problemBktParams = BKTModel.getParametersForSkill(skill, problemDifficulty);
            
            // Add each attempt with its timestamp and problem-specific data
            attemptHistory.forEach(attempt => {
              allAttempts.push({
                correct: attempt.correct,
                timestamp: attempt.timestamp,
                difficulty: problemDifficulty,
                params: problemBktParams
              });
            });
          }
          
          // Sort by timestamp (oldest first)
          allAttempts.sort((a, b) => a.timestamp - b.timestamp);
          
          // Update knowledge sequentially
          for (const attempt of allAttempts) {
            // Create a BKT model with the specific parameters for this attempt
            const attemptModel = new BKTModel(attempt.params);
            
            // Update knowledge state
            p_Ln = attemptModel.updateKnowledge(p_Ln, attempt.correct);
          }
          
          // Use the sequential model if we have enough data points
          if (allAttempts.length >= 3) {
            knowledgeEstimate = p_Ln;
          } else {
            // Otherwise, blend the two estimates
            // More weight to the sequential model as we get more data points
            const weight = allAttempts.length / 3;
            knowledgeEstimate = knowledgeEstimate * (1 - weight) + p_Ln * weight;
          }
        }
        
        // Save the raw knowledge estimate
        this.progress.knowledgeEstimates[skill] = knowledgeEstimate;
        
        // Update the mastery percentage (visible to user)
        this.progress.skillMastery[skill] = Math.round(knowledgeEstimate * 100);
      }
    }
  }
});