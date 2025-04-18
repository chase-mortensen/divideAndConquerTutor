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
  if (!pseudocode || pseudocode.trim() === '') {
    return {
      isCorrect: false,
      feedback: "Please enter your pseudocode solution."
    };
  }

  // Clean the input by removing comments and excess whitespace
  const cleanedCode = cleanPseudocode(pseudocode);
  
  // Get problem-specific validation strategy
  const validationStrategy = getValidationForProblem(problemId);
  
  // Analyze overall structure
  const structureAnalysis = analyzeStructure(cleanedCode);
  
  // Check for required patterns in divide-and-conquer pseudocode
  const patternAnalysis = analyzeDivideAndConquerPatterns(cleanedCode);
  
  // Perform problem-specific validation
  const specificAnalysis = validationStrategy.validate(cleanedCode);
  
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
  
  return {
    isCorrect,
    feedback: feedback.message,
    detailedFeedback: feedback.details,
    analysis: {
      structure: structureAnalysis,
      patterns: patternAnalysis,
      specific: specificAnalysis
    }
  };
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
  if (!specificAnalysis.isValid && specificAnalysis.feedback) {
    // Add the problem-specific feedback
    details.push(...specificAnalysis.feedback);
  }
  
  // Add a reminder about the expected structure
  if (expectedStructure && !specificAnalysis.isValid) {
    details.push(`Remember that the pseudocode should follow this general structure: ${expectedStructure}`);
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
  
  return strategies[problemId] || defaultValidation;
}

/**
 * Default validation when problem-specific strategy is not available
 */
function defaultValidation() {
  return {
    validate: (code) => ({
      isValid: true,  // Default to valid if no specific validation
      feedback: []
    }),
    expectedStructure: "function divide_and_conquer(problem):\n  if base_case(problem):\n    return solve_directly(problem)\n  else:\n    divide problem into subproblems\n    recursively solve each subproblem\n    return combined results"
  };
}

/**
 * Validation for Merge Sort algorithm
 */
function validateMergeSort() {
  return {
    validate: (code) => {
      const feedback = [];
      const isValid = 
        // Check for merge function or merging logic
        (code.match(/merge\s*\(|function\s+merge|procedure\s+merge|def\s+merge/i) !== null ||
         code.match(/while.*left.*right|for.*left.*right/i) !== null) && 
        // Check for array division
        code.match(/mid|middle|length\s*\/\s*2|size\s*\/\s*2/i) !== null &&
        // Check for recursive sorting of subarrays
        code.match(/mergesort\s*\(.*left|mergesort\s*\(.*right|sort\s*\(.*left|sort\s*\(.*right/i) !== null;
      
      if (!isValid) {
        if (!code.match(/merge\s*\(|function\s+merge|procedure\s+merge|def\s+merge/i) !== null) {
          feedback.push("Include a merge function or logic to combine the sorted subarrays.");
        }
        
        if (!code.match(/mid|middle|length\s*\/\s*2|size\s*\/\s*2/i) !== null) {
          feedback.push("Divide the array into two halves at the midpoint.");
        }
        
        if (!code.match(/mergesort\s*\(.*left|mergesort\s*\(.*right|sort\s*\(.*left|sort\s*\(.*right/i) !== null) {
          feedback.push("Recursively sort both halves of the array.");
        }
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