/**
 * Feedback Rules Service
 * 
 * This service implements rule-based feedback for different question types
 * and step types in the divide-and-conquer learning flow.
 */

/**
 * Generate feedback based on the step type, question type, and user's answer
 * 
 * @param {string} stepType - The type of step (decomposition, baseCase, etc.)
 * @param {string} questionType - The type of question (multiple-choice, fill-in-blank, etc.)
 * @param {Object} questionData - The question data
 * @param {*} userAnswer - The user's answer
 * @param {boolean} isCorrect - Whether the answer is correct
 * @param {Array} partialResults - Optional array of partial results (for fill-in-blank, etc.)
 * @returns {Object} Feedback object with message and detailed feedback
 */
export function generateFeedback(stepType, questionType, questionData, userAnswer, isCorrect, partialResults = []) {
  if (isCorrect) {
    return generatePositiveFeedback(stepType);
  } else {
    return generateNegativeFeedback(stepType, questionType, questionData, userAnswer, partialResults);
  }
}

/**
 * Generate feedback for correct answers based on step type
 * 
 * @param {string} stepType - The type of step
 * @returns {Object} Feedback object with message
 */
function generatePositiveFeedback(stepType) {
  const messages = {
    'decomposition': [
      "Excellent! You've correctly identified how to break down this problem.",
      "Great job on decomposing the problem into manageable subproblems!",
      "Correct! You've found an effective way to decompose this problem."
    ],
    'baseCase': [
      "Perfect! You've identified the correct base case for this algorithm.",
      "That's right! This base case will properly terminate the recursive process.",
      "Correct! This base case correctly handles the smallest instance of the problem."
    ],
    'recurrence': [
      "Excellent work on formulating the recurrence relation!",
      "Correct! This recurrence relation accurately describes how subproblems combine.",
      "Perfect! You've identified how the solution is constructed from subproblems."
    ],
    'pseudocode': [
      "Well done! Your pseudocode correctly implements the divide-and-conquer approach.",
      "Excellent job on translating the algorithm into pseudocode!",
      "Perfect! Your solution correctly implements all the necessary steps."
    ]
  };

  // Get messages for this step type or use generic messages
  const stepMessages = messages[stepType] || [
    "Correct! Well done.",
    "That's right! Good job.",
    "Perfect! You've got it."
  ];

  // Select a random message from the available options
  const message = stepMessages[Math.floor(Math.random() * stepMessages.length)];

  return {
    message,
    detailedFeedback: []
  };
}

/**
 * Generate feedback for incorrect answers based on step type and question type
 * 
 * @param {string} stepType - The type of step
 * @param {string} questionType - The type of question
 * @param {Object} questionData - The question data
 * @param {*} userAnswer - The user's answer
 * @param {Array} partialResults - Optional array of partial results
 * @returns {Object} Feedback object with message and detailed feedback
 */
function generateNegativeFeedback(stepType, questionType, questionData, userAnswer, partialResults) {
  // Base message templates for different step types
  const stepTypeMessages = {
    'decomposition': "That approach to decomposing the problem needs refinement.",
    'baseCase': "This base case might not handle all scenarios correctly.",
    'recurrence': "The recurrence relation doesn't correctly combine the subproblems.",
    'pseudocode': "Your pseudocode implementation needs some adjustments."
  };

  // Default message if step type not found
  const message = stepTypeMessages[stepType] || "That's not quite right. Let's try a different approach.";
  
  // Generate detailed feedback based on question type
  let detailedFeedback = [];
  
  switch(questionType) {
    case 'multiple-choice':
      detailedFeedback = generateMultipleChoiceFeedback(stepType, questionData, userAnswer);
      break;
    case 'fill-in-blank':
      detailedFeedback = generateFillInBlankFeedback(stepType, questionData, userAnswer, partialResults);
      break;
    case 'drag-drop':
      detailedFeedback = generateDragDropFeedback(stepType, questionData, userAnswer);
      break;
    case 'free-text':
      detailedFeedback = generateFreeTextFeedback(stepType, questionData, userAnswer);
      break;
    case 'true-false':
      detailedFeedback = generateTrueFalseFeedback(stepType, questionData, userAnswer);
      break;
    default:
      detailedFeedback = ["Review the material and try again."];
  }
  
  return {
    message,
    detailedFeedback
  };
}

/**
 * Generate feedback for multiple choice questions
 */
function generateMultipleChoiceFeedback(stepType, questionData, userAnswer) {
  if (!userAnswer) return ["Please select an answer."];
  
  // Common misconceptions for different step types in multiple choice questions
  const misconceptions = {
    'decomposition': {
      "top-down": "Remember that divide-and-conquer typically starts by splitting the problem, not by solving from the top.",
      "sequential": "Divide-and-conquer is about breaking the problem into independent subproblems, not sequential steps.",
      "iterative": "You're thinking of an iterative approach, but divide-and-conquer is recursive by nature."
    },
    'baseCase': {
      "too-large": "The base case you selected handles too large of a problem. Think simpler.",
      "invalid": "This base case doesn't guarantee the algorithm will terminate.",
      "inefficient": "While this base case works, it's not the most efficient option."
    },
    'recurrence': {
      "incorrect-operation": "Check the operation that combines your subproblems.",
      "missing-terms": "Your recurrence is missing some terms.",
      "wrong-complexity": "This recurrence would lead to a different time complexity than expected."
    },
    'pseudocode': {
      "ordering": "Check the ordering of your operations.",
      "recursive-call": "Verify your recursive call structure.",
      "combination-step": "The way you combine results from subproblems needs adjustment."
    }
  };
  
  // Try to identify which misconception the user might have
  // This would require questionData to have tags for each option
  // indicating which misconception it represents
  if (questionData.optionTags && questionData.optionTags[userAnswer]) {
    const misconceptionType = questionData.optionTags[userAnswer];
    const stepMisconceptions = misconceptions[stepType] || {};
    
    if (stepMisconceptions[misconceptionType]) {
      return [stepMisconceptions[misconceptionType]];
    }
  }
  
  // Generic feedback if we can't identify a specific misconception
  const genericFeedback = {
    'decomposition': ["Consider how the problem can be broken into smaller versions of itself."],
    'baseCase': ["The base case should be the simplest form of the problem that can be solved directly."],
    'recurrence': ["Think about how the solution to the original problem relates to solutions of the subproblems."],
    'pseudocode': ["Ensure your pseudocode correctly implements the divide, conquer, and combine steps."]
  };
  
  return genericFeedback[stepType] || ["Consider the core principles of divide-and-conquer algorithms."];
}

/**
 * Generate feedback for fill-in-blank questions
 */
function generateFillInBlankFeedback(stepType, questionData, userAnswers, partialResults) {
  if (!userAnswers || !userAnswers.length) return ["Please fill in all blanks."];
  if (!partialResults || !partialResults.length) return ["Check your answers and try again."];
  
  const feedback = [];
  
  // If questionData has hints for specific blanks, use them
  if (questionData.blankHints) {
    partialResults.forEach((isCorrect, index) => {
      if (!isCorrect && questionData.blankHints[index]) {
        feedback.push(questionData.blankHints[index]);
      }
    });
  }
  
  // If we couldn't generate specific feedback, use generic feedback
  if (feedback.length === 0) {
    // Count how many are incorrect
    const incorrectCount = partialResults.filter(result => !result).length;
    
    if (incorrectCount === partialResults.length) {
      feedback.push("All of your answers need revision.");
    } else if (incorrectCount > 1) {
      feedback.push(`${incorrectCount} of your answers need revision.`);
    } else {
      feedback.push("One of your answers needs revision.");
    }
    
    // Add step-specific guidance
    const guidanceFeedback = {
      'decomposition': ["Focus on how to split the problem into independent subproblems."],
      'baseCase': ["Think about the simplest version of this problem."],
      'recurrence': ["Check the mathematical relationship between the problem and subproblems."],
      'pseudocode': ["Review the algorithm structure for this divide-and-conquer approach."]
    };
    
    if (guidanceFeedback[stepType]) {
      feedback.push(guidanceFeedback[stepType][0]);
    }
  }
  
  return feedback;
}

/**
 * Generate feedback for drag-and-drop questions
 */
function generateDragDropFeedback(stepType, questionData, userAnswer) {
  // For algorithm steps ordering
  if (stepType === 'pseudocode' || questionData.isAlgorithmSteps) {
    return [
      "Check the ordering of the algorithm steps.",
      "Remember that divide-and-conquer follows: divide the problem, solve subproblems, combine results."
    ];
  }
  
  // For decomposition structure
  if (stepType === 'decomposition') {
    return [
      "Consider the hierarchical nature of the problem decomposition.",
      "Make sure your decomposition breaks the problem into non-overlapping subproblems."
    ];
  }
  
  // Generic feedback
  return ["The ordering is not correct. Try rearranging the items."];
}

/**
 * Generate feedback for free text questions
 */
function generateFreeTextFeedback(stepType, questionData, userAnswer) {
  if (!userAnswer || userAnswer.trim() === '') return ["Please provide an answer."];
  
  // Generic feedback based on step type
  const feedback = {
    'decomposition': [
      "Your decomposition strategy may not effectively break down the problem.",
      "Consider how to divide this problem into independent subproblems of the same type."
    ],
    'baseCase': [
      "Your base case might not be simple enough.",
      "Ensure your base case covers all termination scenarios."
    ],
    'recurrence': [
      "Your recurrence relation may not correctly describe how subproblems combine.",
      "Check if your recurrence relation captures the divide-and-conquer nature of the algorithm."
    ],
    'pseudocode': [
      "Your pseudocode may not correctly implement all steps of the algorithm.",
      "Make sure your pseudocode includes divide, conquer, and combine phases."
    ]
  };
  
  return feedback[stepType] || ["Your answer needs revision. Try a different approach."];
}

/**
 * Generate feedback for true/false questions
 */
function generateTrueFalseFeedback(stepType, questionData, userAnswer) {
  // If question data has a specific explanation for the wrong answer, use it
  if (questionData.explanation) {
    return [questionData.explanation];
  }
  
  // Generic feedback based on step type
  const feedback = {
    'decomposition': ["Reconsider how divide-and-conquer problems should be decomposed."],
    'baseCase': ["Review the criteria for a proper base case in this algorithm."],
    'recurrence': ["Think about how the subproblems relate to the original problem."],
    'pseudocode': ["Examine the structure of divide-and-conquer algorithms more carefully."]
  };
  
  return feedback[stepType] || ["That's not correct. Consider the statement more carefully."];
}

/**
 * Analyze user's performance to suggest next learning actions
 * 
 * @param {Object} performanceHistory - User's performance history for this problem/step
 * @param {number} knowledgeEstimate - BKT knowledge estimate (0-1)
 * @returns {string} Suggestion for next learning action
 */
export function suggestNextAction(performanceHistory, knowledgeEstimate) {
  // No history yet
  if (!performanceHistory || (!performanceHistory.correct && !performanceHistory.incorrect)) {
    return "Try solving this step to build your understanding.";
  }
  
  const attempts = (performanceHistory.correct || 0) + (performanceHistory.incorrect || 0);
  const successRate = performanceHistory.correct / attempts;
  
  // Many unsuccessful attempts
  if (attempts > 3 && successRate < 0.5) {
    return "You might benefit from reviewing the fundamentals of divide-and-conquer before continuing.";
  }
  
  // Struggling recently
  if (performanceHistory.incorrect > 2 && knowledgeEstimate < 0.4) {
    return "Consider reviewing related examples before trying again.";
  }
  
  // Doing well but not mastered
  if (successRate > 0.7 && knowledgeEstimate > 0.6 && knowledgeEstimate < 0.9) {
    return "You're on the right track! Try a more challenging problem next.";
  }
  
  // Mastery achieved
  if (knowledgeEstimate > 0.9) {
    return "You've demonstrated strong understanding. Consider helping others or moving to advanced topics.";
  }
  
  // Default suggestion
  return "Keep practicing to strengthen your understanding.";
}