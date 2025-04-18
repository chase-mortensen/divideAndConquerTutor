/**
 * Bayesian Knowledge Tracing (BKT) Model
 * 
 * This implementation models student knowledge as a hidden Markov model
 * with the following parameters:
 * 
 * - p(L0): Initial probability of knowing the skill (prior knowledge)
 * - p(T): Probability of learning the skill if it was previously unknown (transition)
 * - p(G): Probability of guessing correctly despite not knowing the skill (guess)
 * - p(S): Probability of making a mistake despite knowing the skill (slip)
 */

export default class BKTModel {
  constructor(params = {}) {
    // Default parameters based on typical values found in research
    this.p_L0 = params.p_L0 ?? 0.3;  // Initial probability of knowledge
    this.p_T = params.p_T ?? 0.09;   // Transition probability (learning rate)
    this.p_G = params.p_G ?? 0.2;    // Guess probability
    this.p_S = params.p_S ?? 0.1;    // Slip probability
    
    // Optional decay factor (knowledge decay over time)
    this.p_D = params.p_D ?? 0.02;   // Decay factor (probability of forgetting)
    
    // Additional metadata for model calibration
    this.skillType = params.skillType || '';
    this.difficulty = params.difficulty || 'intermediate';
    this.calibrationCount = 0;       // How many data points used for calibration
  }

  /**
   * Update the knowledge estimate based on student performance
   * @param {number} p_Ln - Current probability of knowledge
   * @param {boolean} correct - Whether the student's response was correct
   * @returns {number} Updated probability of knowledge
   */
  updateKnowledge(p_Ln, correct) {
    if (correct) {
      // Formula for correct answer
      const numerator = p_Ln * (1 - this.p_S);
      const denominator = p_Ln * (1 - this.p_S) + (1 - p_Ln) * this.p_G;
      const p_Ln_plus = numerator / denominator;
      
      // Apply transition probability
      return p_Ln_plus + (1 - p_Ln_plus) * this.p_T;
    } else {
      // Formula for incorrect answer
      const numerator = p_Ln * this.p_S;
      const denominator = p_Ln * this.p_S + (1 - p_Ln) * (1 - this.p_G);
      const p_Ln_plus = numerator / denominator;
      
      // Apply transition probability
      return p_Ln_plus + (1 - p_Ln_plus) * this.p_T;
    }
  }

  /**
   * Apply knowledge decay based on elapsed time
   * @param {number} p_Ln - Current probability of knowledge
   * @param {number} elapsedDays - Number of days since last practice
   * @returns {number} Decayed probability of knowledge
   */
  applyKnowledgeDecay(p_Ln, elapsedDays) {
    if (!elapsedDays || elapsedDays <= 0) return p_Ln;
    
    // Apply exponential decay with a floor at p_L0 (don't decay below prior)
    // Less decay for more stable knowledge (higher p_Ln)
    const stability = Math.sqrt(p_Ln); // Higher knowledge = more stability
    const decayRate = this.p_D * (1 - stability);
    const decayFactor = Math.exp(-decayRate * elapsedDays);
    
    // Calculate decayed knowledge but don't drop below prior
    return Math.max(this.p_L0, this.p_L0 + (p_Ln - this.p_L0) * decayFactor);
  }

  /**
   * Calculate the mastery level based on the number of correct/incorrect answers
   * @param {Object} history - Object containing the history of attempts
   * @returns {number} Mastery level as a percentage (0-100)
   */
  calculateMastery(history) {
    // If no history, return the prior probability
    if (!history || (!history.correct && !history.incorrect)) {
      return Math.round(this.p_L0 * 100);
    }

    // Start with prior probability
    let p_Ln = this.p_L0;
    
    // Apply all correct answers first
    for (let i = 0; i < (history.correct || 0); i++) {
      p_Ln = this.updateKnowledge(p_Ln, true);
    }
    
    // Then apply all incorrect answers
    for (let i = 0; i < (history.incorrect || 0); i++) {
      p_Ln = this.updateKnowledge(p_Ln, false);
    }
    
    // Return as percentage
    return Math.round(p_Ln * 100);
  }

  /**
   * Calculate mastery based on a sequence of timestamped attempts
   * @param {Array} attemptSequence - Array of objects with {correct, timestamp}
   * @returns {number} Mastery level as a percentage (0-100)
   */
  calculateSequentialMastery(attemptSequence) {
    if (!attemptSequence || attemptSequence.length === 0) {
      return Math.round(this.p_L0 * 100);
    }
    
    // Sort attempts by timestamp (oldest first)
    const sortedAttempts = [...attemptSequence].sort((a, b) => 
      a.timestamp - b.timestamp
    );
    
    // Start with prior probability
    let p_Ln = this.p_L0;
    let lastTimestamp = sortedAttempts[0].timestamp;
    
    // Process each attempt in sequence
    for (const attempt of sortedAttempts) {
      // Calculate time elapsed since last attempt (in days)
      const elapsedMs = attempt.timestamp - lastTimestamp;
      const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24);
      
      // Apply knowledge decay if significant time has passed
      if (elapsedDays > 0.5) { // Only apply decay for gaps > 12 hours
        p_Ln = this.applyKnowledgeDecay(p_Ln, elapsedDays);
      }
      
      // Update knowledge based on correctness
      p_Ln = this.updateKnowledge(p_Ln, attempt.correct);
      
      // Update last timestamp
      lastTimestamp = attempt.timestamp;
    }
    
    // Return as percentage
    return Math.round(p_Ln * 100);
  }

  /**
   * Calculate the probability that a student will answer correctly on the next attempt
   * @param {number} p_Ln - Current probability of knowledge
   * @returns {number} Probability of correct answer
   */
  predictPerformance(p_Ln) {
    // Probability correct = p(knows) * p(not slip) + p(doesn't know) * p(guess)
    return p_Ln * (1 - this.p_S) + (1 - p_Ln) * this.p_G;
  }

  /**
   * Determine if the skill is considered mastered
   * @param {number} p_Ln - Current probability of knowledge
   * @param {number} threshold - Mastery threshold (default: 0.95)
   * @returns {boolean} Whether the skill is mastered
   */
  isMastered(p_Ln, threshold = 0.95) {
    return p_Ln >= threshold;
  }

  /**
   * Predict how many more attempts are needed to reach mastery
   * @param {number} p_Ln - Current knowledge estimate
   * @param {number} threshold - Mastery threshold (default: 0.95)
   * @returns {number} Estimated number of correct attempts needed
   */
  attemptsToMastery(p_Ln, threshold = 0.95) {
    if (p_Ln >= threshold) return 0;
    
    let currentP = p_Ln;
    let attempts = 0;
    
    // Simulate correct answers until mastery is reached
    while (currentP < threshold && attempts < 100) { // Limit to prevent infinite loop
      currentP = this.updateKnowledge(currentP, true);
      attempts++;
    }
    
    return attempts;
  }

  /**
   * Suggest the next best problem difficulty based on current knowledge
   * @param {number} p_Ln - Current knowledge estimate
   * @returns {string} Recommended difficulty level
   */
  recommendDifficulty(p_Ln) {
    if (p_Ln < 0.4) return 'beginner';
    if (p_Ln < 0.75) return 'intermediate';
    return 'advanced';
  }

  /**
   * Get the parameters for a specific skill type, customized based on difficulty
   * @param {string} skillType - The type of skill (decomposition, base-case, etc.)
   * @param {string} difficulty - The difficulty level (beginner, intermediate, advanced)
   * @returns {Object} BKT parameters for the skill
   */
  static getParametersForSkill(skillType, difficulty = 'intermediate') {
    // Default parameters
    const defaults = {
      p_L0: 0.3,
      p_T: 0.09,
      p_G: 0.2,
      p_S: 0.1,
      p_D: 0.02
    };

    // Skill-specific adjustments
    const skillAdjustments = {
      'decomposition': { p_L0: 0.35, p_T: 0.12 },
      'base-case': { p_L0: 0.4, p_T: 0.10 },
      'recurrence': { p_L0: 0.25, p_T: 0.08 },
      'pseudocode': { p_L0: 0.3, p_T: 0.07 }
    };

    // Difficulty-specific adjustments
    const difficultyFactors = {
      'beginner': { p_L0: 1.2, p_T: 1.2, p_G: 1.1, p_S: 0.9, p_D: 0.9 },
      'intermediate': { p_L0: 1.0, p_T: 1.0, p_G: 1.0, p_S: 1.0, p_D: 1.0 },
      'advanced': { p_L0: 0.8, p_T: 0.8, p_G: 0.9, p_S: 1.1, p_D: 1.1 }
    };

    // Start with defaults
    const params = { ...defaults };

    // Apply skill-specific adjustments if available
    if (skillAdjustments[skillType]) {
      Object.assign(params, skillAdjustments[skillType]);
    }

    // Apply difficulty factors
    const factors = difficultyFactors[difficulty] || difficultyFactors.intermediate;
    for (const [key, value] of Object.entries(params)) {
      params[key] = Math.max(0.01, Math.min(0.99, value * factors[key]));
    }

    // Add metadata
    params.skillType = skillType;
    params.difficulty = difficulty;

    return params;
  }
  
  /**
   * Calibrate model parameters based on observed data
   * @param {Array} observations - Array of objects with {input: knowledge estimate, output: actual correctness}
   * @returns {Object} Updated parameters
   */
  calibrateParameters(observations) {
    if (!observations || observations.length < 5) {
      return this; // Not enough data to calibrate
    }
    
    this.calibrationCount += observations.length;
    
    // Calculate prediction errors
    let totalError = 0;
    let slipErr = 0;
    let guessErr = 0;
    
    for (const obs of observations) {
      const predictedProb = this.predictPerformance(obs.input);
      const actual = obs.output ? 1 : 0;
      const error = actual - predictedProb;
      totalError += Math.abs(error);
      
      // Collect errors by case
      if (obs.input > 0.7 && !obs.output) {
        // Likely slip (high knowledge but incorrect)
        slipErr += 1;
      } else if (obs.input < 0.3 && obs.output) {
        // Likely guess (low knowledge but correct)
        guessErr += 1;
      }
    }
    
    // Adjust parameters slightly based on observations
    if (slipErr > observations.length * 0.1) {
      // Too many slips, increase slip probability
      this.p_S = Math.min(0.3, this.p_S * 1.1);
    }
    
    if (guessErr > observations.length * 0.2) {
      // Too many lucky guesses, increase guess probability
      this.p_G = Math.min(0.3, this.p_G * 1.1);
    }
    
    return this;
  }
}