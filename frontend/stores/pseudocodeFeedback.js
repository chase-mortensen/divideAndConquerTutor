/**
 * Pseudocode Feedback System
 * 
 * This module provides analysis and feedback generation for pseudocode
 * in the context of divide-and-conquer algorithms.
 */

/**
 * Analyzes pseudocode for divide-and-conquer patterns and provides feedback
 * 
 * @param {string} problemId - The ID of the problem (e.g., 'merge-sort')
 * @param {string} pseudocode - The student's pseudocode submission
 * @returns {Object} Analysis result with validation and feedback
 */
export function analyzePseudocode(problemId, pseudocode) {
  try {
    console.log(`Analyzing pseudocode for problem ${problemId}`);
    console.log(`Input pseudocode:`, pseudocode);
    
    if (!pseudocode || pseudocode.trim() === '') {
      console.log('Empty pseudocode submitted');
      return {
        isCorrect: false,
        feedback: "Please enter your pseudocode solution.",
        detailedFeedback: ["Your answer is empty. Please write some pseudocode."]
      };
    }

    // Clean the input by removing comments and excess whitespace
    const cleanedCode = cleanPseudocode(pseudocode);
    console.log('Cleaned code:', cleanedCode);
    
    // Get problem-specific validation strategy
    const validationStrategy = getValidationForProblem(problemId);
    console.log('Using validation strategy for:', problemId);
    
    // Analyze overall structure
    const structureAnalysis = analyzeStructure(cleanedCode);
    console.log('Structure analysis:', structureAnalysis);
    
    // Check for required patterns in divide-and-conquer pseudocode
    const patternAnalysis = analyzeDivideAndConquerPatterns(cleanedCode);
    console.log('Pattern analysis:', patternAnalysis);
    
    // Perform problem-specific validation
    let specificAnalysis;
    try {
      specificAnalysis = validationStrategy.validate(cleanedCode);
      console.log('Specific analysis:', specificAnalysis);
    } catch (error) {
      console.error('Error during specific validation:', error);
      specificAnalysis = { isValid: false, feedback: ["Error validating your code. Try using a clearer structure."] };
    }
    
    // Combine analysis results to determine overall correctness
    const isCorrect = 
      structureAnalysis.isValid && 
      patternAnalysis.hasRequiredPatterns &&
      specificAnalysis.isValid;
    
    // Generate appropriate feedback based on the analysis
    const feedback = generateFeedback(
      structureAnalysis, 
      patternAnalysis, 
      specificAnalysis, 
      validationStrategy.expectedStructure
    );
    
    console.log('Generated feedback:', feedback);
    
    // Make sure detailedFeedback is always an array
    const detailedFeedback = feedback.details || [];
    
    // Force some feedback if there's none (fallback)
    if (detailedFeedback.length === 0) {
      detailedFeedback.push("Your pseudocode needs improvement. Try including base cases, divide steps, and combine steps.");
    }
    
    const result = {
      isCorrect,
      feedback: feedback.message,
      detailedFeedback: detailedFeedback,
      analysis: {
        structure: structureAnalysis,
        patterns: patternAnalysis,
        specific: specificAnalysis
      }
    };
    
    console.log('Final analysis result:', result);
    return result;
  } catch (error) {
    console.error('Error in analyzePseudocode:', error);
    // Return a fallback result with helpful feedback
    return {
      isCorrect: false,
      feedback: "There was an error analyzing your pseudocode.",
      detailedFeedback: [
        "Please make sure your pseudocode follows these guidelines:",
        "1. Define a function with parameters",
        "2. Include a base case for the simplest version of the problem",
        "3. Divide the problem into smaller subproblems",
        "4. Recursively solve each subproblem",
        "5. Combine the subproblem solutions"
      ]
    };
  }
}

/**
 * Clean pseudocode by removing comments and normalizing whitespace
 */
function cleanPseudocode(code) {
  // Remove single-line comments (both // and #)
  let cleaned = code.replace(/\/\/.*|#.*/g, '');
  
  // Remove multi-line comments
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Normalize whitespace (but preserve indentation)
  const lines = cleaned.split('\n').map(line => {
    // Trim right side only to preserve indentation
    return line.replace(/\s+$/, '');
  }).filter(line => line.trim() !== ''); // Remove empty lines
  
  return lines.join('\n');
}

/**
 * Analyze general pseudocode structure
 */
function analyzeStructure(code) {
  const lines = code.split('\n');
  const nonEmptyLines = lines.filter(line => line.trim() !== '');
  
  // Check for minimal length
  const hasSufficientLength = nonEmptyLines.length >= 3;
  
  // Check for function definition
  const hasFunctionDef = code.match(/function\s+\w+\s*\(.*\)/i) !== null ||
                         code.match(/procedure\s+\w+\s*\(.*\)/i) !== null || 
                         code.match(/\w+\s*\(.*\):/i) !== null;
  
  // Check for control structures
  const hasControlStructures = 
    code.match(/if|else|while|for|return/i) !== null;
  
  // Check for indentation/structure
  const hasProperIndentation = checkIndentation(lines);
  
  // Check for return statement
  const hasReturnStatement = code.match(/return/i) !== null;
  
  return {
    isValid: hasSufficientLength && hasControlStructures,
    hasFunctionDef,
    hasControlStructures,
    hasProperIndentation,
    hasReturnStatement,
    lineCount: nonEmptyLines.length
  };
}

/**
 * Check if the indentation follows a consistent pattern
 */
function checkIndentation(lines) {
  if (lines.length <= 1) return true;
  
  let indentationLevels = [];
  let previousIndent = 0;
  let indentationIncreased = false;
  
  for (const line of lines) {
    if (line.trim() === '') continue;
    
    // Calculate indentation by counting leading spaces
    const indent = line.search(/\S/);
    if (indent === -1) continue; // Skip empty lines
    
    // Track indentation level changes
    if (indent > previousIndent) {
      indentationIncreased = true;
    }
    
    // Store this indentation level if new
    if (!indentationLevels.includes(indent)) {
      indentationLevels.push(indent);
    }
    
    previousIndent = indent;
  }
  
  // Code should have at least two indentation levels in proper structure
  // and show evidence of increased indentation at some point
  return indentationLevels.length >= 2 && indentationIncreased;
}

/**
 * Analyze for divide-and-conquer specific patterns
 */
function analyzeDivideAndConquerPatterns(code) {
  // Check for base case handling
  const hasBaseCaseCheck = 
    code.match(/if\s+.*\s*<=\s*1|if\s+.*\s*==\s*1|if\s+.*\s*===\s*1|if\s+.*\.length\s*<=\s*1/i) !== null ||
    code.match(/if\s+.*empty|if\s+.*base case/i) !== null;
  
  // Check for recursive calls (looking for function calling itself)
  // Extract function name and look for it being called
  let functionName = '';
  const functionMatch = code.match(/function\s+(\w+)|procedure\s+(\w+)|(\w+)\s*\(.*\):/i);
  if (functionMatch) {
    functionName = functionMatch[1] || functionMatch[2] || functionMatch[3];
    functionName = functionName.trim();
  }
  
  // Look for the function calling itself (recursion)
  const hasRecursiveCalls = functionName !== '' && 
    (new RegExp(`${functionName}\\s*\\(`, 'i')).test(code);
  
  // Check for divide step (splitting input)
  const hasDivideStep = 
    code.match(/mid|middle|split|half|divide/i) !== null && 
    code.match(/=|\+=|-=|\*=|\/=|%=|&=|\|=|\^=|<<=|>>=|>>>=|\*\*=/) !== null;
  
  // Check for combine/merge step
  const hasCombineStep = 
    code.match(/merge|combine|join|concat|max|return.*\+|return.*max/i) !== null;
  
  // Determine overall pattern completeness
  const hasRequiredPatterns = hasBaseCaseCheck && 
    (hasRecursiveCalls || hasDivideStep) && // Must have either recursion or division
    hasCombineStep; // Must have combine step
  
  return {
    hasBaseCaseCheck,
    hasRecursiveCalls,
    hasDivideStep,
    hasCombineStep,
    hasRequiredPatterns
  };
}

/**
 * Generate feedback based on the analysis results
 */
function generateFeedback(structureAnalysis, patternAnalysis, specificAnalysis, expectedStructure) {
  // If everything is correct, provide positive feedback
  if (structureAnalysis.isValid && 
      patternAnalysis.hasRequiredPatterns && 
      specificAnalysis.isValid) {
    return {
      message: "Your pseudocode correctly implements the divide-and-conquer approach.",
      details: [
        "Well done! Your solution demonstrates understanding of the algorithm."
      ]
    };
  }
  
  // Otherwise, generate constructive feedback based on the issues found
  const details = [];
  
  // Structural feedback
  if (!structureAnalysis.isValid) {
    if (!structureAnalysis.hasFunctionDef) {
      details.push("Your pseudocode should define a function with parameters.");
    }
    
    if (!structureAnalysis.hasControlStructures) {
      details.push("Include control structures like if, else, loops, and return statements.");
    }
    
    if (!structureAnalysis.hasProperIndentation) {
      details.push("Use consistent indentation to show the structure of your algorithm.");
    }
    
    if (structureAnalysis.lineCount < 3) {
      details.push("Your solution seems too short. Divide-and-conquer algorithms typically require multiple steps.");
    }
  }
  
  // Divide-and-conquer pattern feedback
  if (!patternAnalysis.hasRequiredPatterns) {
    if (!patternAnalysis.hasBaseCaseCheck) {
      details.push("Include a base case to handle the simplest version of the problem directly.");
    }
    
    if (!patternAnalysis.hasRecursiveCalls && !patternAnalysis.hasDivideStep) {
      details.push("Your algorithm should divide the problem into smaller instances and solve them recursively.");
    }
    
    if (!patternAnalysis.hasCombineStep) {
      details.push("Include a step to combine solutions from the subproblems into a solution for the original problem.");
    }
  }
  
  // Problem-specific feedback
  if (specificAnalysis.feedback && specificAnalysis.feedback.length > 0) {
    // Add the problem-specific feedback
    details.push(...specificAnalysis.feedback);
  }
  
  // Add a reminder about the expected structure
  if (expectedStructure) {
    details.push(`Your pseudocode should follow this general structure:\n${expectedStructure}`);
  }
  
  // If we still don't have any details, add general D&C guidance
  if (details.length === 0) {
    details.push("Remember the three key components of divide-and-conquer:");
    details.push("1. Base case - handle the simplest version directly");
    details.push("2. Divide - break the problem into smaller subproblems");
    details.push("3. Combine - merge the solutions of subproblems into the final solution");
  }
  
  return {
    message: "Your pseudocode implementation needs some improvements.",
    details: details
  };
}

/**
 * Get problem-specific validation strategy
 */
function getValidationForProblem(problemId) {
  const strategies = {
    'merge-sort': validateMergeSort,
    'binary-search': validateBinarySearch,
    'maximum-subarray': validateMaximumSubarray,
    'quick-sort': validateQuickSort,
    'closest-pair': validateClosestPair,
    'matrix-multiplication': validateMatrixMultiplication
  };
  
  // Make sure to call the function to get the strategy object
  const validationFunction = strategies[problemId] || defaultValidation;
  console.log("Using validation function:", validationFunction.name || 'defaultValidation');
  
  try {
    const strategy = validationFunction();
    // Make sure the returned strategy has a validate method
    if (typeof strategy.validate !== 'function') {
      console.error("Invalid validation strategy - missing validate function");
      return defaultValidation();
    }
    return strategy;
  } catch (error) {
    console.error("Error getting validation strategy:", error);
    return defaultValidation();
  }
}

/**
 * Default validation when problem-specific strategy is not available
 */
function defaultValidation() {
  return {
    validate: function(code) {
      return {
        isValid: true,  // Default to valid if no specific validation
        feedback: []
      };
    },
    expectedStructure: "function divide_and_conquer(problem):\n  if base_case(problem):\n    return solve_directly(problem)\n  else:\n    divide problem into subproblems\n    recursively solve each subproblem\n    return combined results"
  };
}

/**
 * Validation for Merge Sort algorithm
 */
function validateMergeSort() {
  return {
    validate: function(code) {
      const feedback = [];
      
      // Check for merge function or merging logic
      const hasMergeFunction = (code.match(/merge\s*\(|function\s+merge|procedure\s+merge|def\s+merge/i) !== null);
      const hasMergeLogic = (code.match(/while.*left.*right|for.*left.*right/i) !== null);
      
      // Check for array division
      const hasDivision = (code.match(/mid|middle|length\s*\/\s*2|size\s*\/\s*2/i) !== null);
      
      // Check for recursive sorting of subarrays
      const hasRecursiveSorting = (code.match(/mergesort\s*\(.*left|mergesort\s*\(.*right|sort\s*\(.*left|sort\s*\(.*right/i) !== null);
      
      const isValid = (hasMergeFunction || hasMergeLogic) && hasDivision && hasRecursiveSorting;
      
      if (!hasMergeFunction && !hasMergeLogic) {
        feedback.push("Include a merge function or logic to combine the sorted subarrays.");
      }
      
      if (!hasDivision) {
        feedback.push("Divide the array into two halves at the midpoint.");
      }
      
      if (!hasRecursiveSorting) {
        feedback.push("Recursively sort both halves of the array.");
      }
      
      // Always provide feedback for merge sort implementation
      if (feedback.length === 0) {
        feedback.push("Your merge sort implementation is missing some key elements.");
      }
      
      return {
        isValid,
        feedback
      };
    },
    expectedStructure: "function mergeSort(array):\n  if array.length <= 1:\n    return array\n  mid = array.length / 2\n  left = mergeSort(first half of array)\n  right = mergeSort(second half of array)\n  return merge(left, right)"
  };
}

/**
 * Validation for Binary Search algorithm
 */
function validateBinarySearch() {
  return {
    validate: (code) => {
      const feedback = [];
      const isValid = 
        // Check for middle element calculation
        code.match(/mid|middle|start.*end|left.*right/i) !== null &&
        // Check for comparison with target
        code.match(/[<>=]=?.*target|target.*[<>=]=?/i) !== null &&
        // Check for updating search bounds
        code.match(/(low|left|start)\s*=\s*mid|(high|right|end)\s*=\s*mid/i) !== null &&
        // Check for return statement
        code.match(/return/i) !== null;
      
      if (!isValid) {
        if (!code.match(/mid|middle|start.*end|left.*right/i) !== null) {
          feedback.push("Calculate the middle element of the search range.");
        }
        
        if (!code.match(/[<>=]=?.*target|target.*[<>=]=?/i) !== null) {
          feedback.push("Compare the middle element with the target value.");
        }
        
        if (!code.match(/(low|left|start)\s*=\s*mid|(high|right|end)\s*=\s*mid/i) !== null) {
          feedback.push("Update the search bounds based on the comparison result.");
        }
      }
      
      return {
        isValid,
        feedback
      };
    },
    expectedStructure: "function binarySearch(array, target):\n  left = 0\n  right = array.length - 1\n  while left <= right:\n    mid = (left + right) / 2\n    if array[mid] == target:\n      return mid\n    if array[mid] < target:\n      left = mid + 1\n    else:\n      right = mid - 1\n  return -1 // Not found"
  };
}

/**
 * Validation for Maximum Subarray algorithm
 */
function validateMaximumSubarray() {
  return {
    validate: (code) => {
      const feedback = [];
      const isValid = 
        // Check for midpoint calculation
        code.match(/mid|middle|length\s*\/\s*2|size\s*\/\s*2/i) !== null &&
        // Check for three cases (left, right, crossing)
        code.match(/cross|left.*right|max.*three/i) !== null &&
        // Check for return with max comparison
        code.match(/return\s+max|return.*Math\.max|max\s*\(/i) !== null;
      
      if (!isValid) {
        if (!code.match(/mid|middle|length\s*\/\s*2|size\s*\/\s*2/i) !== null) {
          feedback.push("Divide the array at the midpoint.");
        }
        
        if (!code.match(/cross|left.*right|max.*three/i) !== null) {
          feedback.push("Consider the three cases: maximum subarray in left half, right half, or crossing the midpoint.");
        }
        
        if (!code.match(/return\s+max|return.*Math\.max|max\s*\(/i) !== null) {
          feedback.push("Return the maximum of the three cases.");
        }
      }
      
      return {
        isValid,
        feedback
      };
    },
    expectedStructure: "function findMaxSubarray(array):\n  if array.length <= 1:\n    return array[0]\n  mid = array.length / 2\n  leftMax = findMaxSubarray(left half)\n  rightMax = findMaxSubarray(right half)\n  crossMax = findMaxCrossingSubarray(array, mid)\n  return max(leftMax, rightMax, crossMax)"
  };
}

/**
 * Validation for Quick Sort algorithm
 */
function validateQuickSort() {
  return {
    validate: (code) => {
      const feedback = [];
      const isValid = 
        // Check for pivot selection
        code.match(/pivot|partition/i) !== null &&
        // Check for partition/rearrange logic
        code.match(/partition|rearrange|swap|[<>=]=?.*pivot|pivot.*[<>=]=?/i) !== null &&
        // Check for recursive calls
        code.match(/quicksort.*left|quicksort.*right|sort.*left|sort.*right/i) !== null;
      
      if (!isValid) {
        if (!code.match(/pivot|partition/i) !== null) {
          feedback.push("Select a pivot element for partitioning.");
        }
        
        if (!code.match(/partition|rearrange|swap|[<>=]=?.*pivot|pivot.*[<>=]=?/i) !== null) {
          feedback.push("Rearrange elements around the pivot (elements less than pivot on left, greater on right).");
        }
        
        if (!code.match(/quicksort.*left|quicksort.*right|sort.*left|sort.*right/i) !== null) {
          feedback.push("Recursively sort the subarrays on both sides of the pivot.");
        }
      }
      
      return {
        isValid,
        feedback
      };
    },
    expectedStructure: "function quickSort(array):\n  if array.length <= 1:\n    return array\n  pivot = selectPivot(array)\n  partition array around pivot\n  recursively sort left subarray\n  recursively sort right subarray\n  return combined result"
  };
}

/**
 * Validation for Closest Pair algorithm
 */
function validateClosestPair() {
  return {
    validate: (code) => {
      const feedback = [];
      const isValid = 
        // Check for sorting or organizing points
        code.match(/sort|x|y|coordinate/i) !== null &&
        // Check for divide step
        code.match(/mid|middle|length\s*\/\s*2|size\s*\/\s*2/i) !== null &&
        // Check for distance calculation
        code.match(/distance|dist|sqrt|square|pow/i) !== null &&
        // Check for strip or cross-boundary handling
        code.match(/strip|band|cross|boundary/i) !== null;
      
      if (!isValid) {
        if (!code.match(/sort|x|y|coordinate/i) !== null) {
          feedback.push("Sort points by x or y coordinate.");
        }
        
        if (!code.match(/mid|middle|length\s*\/\s*2|size\s*\/\s*2/i) !== null) {
          feedback.push("Divide the points into two sets around the midpoint.");
        }
        
        if (!code.match(/distance|dist|sqrt|square|pow/i) !== null) {
          feedback.push("Calculate distances between points.");
        }
        
        if (!code.match(/strip|band|cross|boundary/i) !== null) {
          feedback.push("Handle the case where the closest pair crosses the dividing line.");
        }
      }
      
      return {
        isValid,
        feedback
      };
    },
    expectedStructure: "function closestPair(points):\n  if points.length <= 3:\n    return bruteForceClosestPair(points)\n  sortPointsByX(points)\n  mid = points.length / 2\n  leftClosest = closestPair(left half points)\n  rightClosest = closestPair(right half points)\n  delta = min(leftClosest, rightClosest)\n  return min(delta, closestCrossingPair(points, mid, delta))"
  };
}

/**
 * Validation for Strassen's Matrix Multiplication algorithm
 */
function validateMatrixMultiplication() {
  return {
    validate: (code) => {
      const feedback = [];
      const isValid = 
        // Check for matrix division
        code.match(/submatrix|partition|divide|block|quadrant/i) !== null &&
        // Check for 7 multiplications (Strassen's algorithm)
        code.match(/p1|p2|p3|p4|p5|p6|p7|seven|7.*multipl/i) !== null &&
        // Check for matrix combination
        code.match(/c11|c12|c21|c22|combine|result/i) !== null;
      
      if (!isValid) {
        if (!code.match(/submatrix|partition|divide|block|quadrant/i) !== null) {
          feedback.push("Divide matrices into submatrices or blocks.");
        }
        
        if (!code.match(/p1|p2|p3|p4|p5|p6|p7|seven|7.*multipl/i) !== null) {
          feedback.push("Use Strassen's approach with 7 matrix multiplications instead of 8.");
        }
        
        if (!code.match(/c11|c12|c21|c22|combine|result/i) !== null) {
          feedback.push("Combine the results to form the product matrix.");
        }
      }
      
      return {
        isValid,
        feedback
      };
    },
    expectedStructure: "function strassenMultiply(A, B):\n  if matrices are small:\n    return regular multiplication\n  divide A and B into 4 submatrices each\n  compute 7 products using Strassen's formulas\n  compute the 4 submatrices of the result using the products\n  combine submatrices and return the result"
  };
}