import { defineStore } from 'pinia';
import { DIFFICULTY, STEP_TYPE, QUESTION_TYPE } from '~/constants';

export const useProblemStore = defineStore('problems', {
  state: () => ({
    problems: [
      {
        id: 'merge-sort',
        title: 'Merge Sort',
        difficulty: DIFFICULTY.BEGINNER,
        category: 'Sorting',
        featured: true,
        estimatedTime: '20 mins',
        description: 'The Merge Sort algorithm is a classic divide-and-conquer algorithm for sorting arrays. It works by recursively dividing the array in half, sorting each half, and then merging the sorted halves back together. Your task is to understand the divide-and-conquer aspects of the Merge Sort algorithm before implementing it.',
        learningObjectives: [
          'Understand how to decompose a sorting problem into smaller subproblems',
          'Identify appropriate base cases for the recursion',
          'Formulate the recurrence relation that describes the algorithm\'s time complexity',
          'Develop correct pseudocode for the Merge Sort algorithm'
        ],
        hints: [
          'Merge Sort is a general divide-and-conquer algorithm for sorting',
          'Think about how the problem is broken down recursively',
          'Consider the efficiency advantages of this approach'
        ],
        steps: [
          {
            id: STEP_TYPE.DECOMPOSITION,
            title: 'Problem Decomposition',
            instructions: 'In the first step, you need to identify how the Merge Sort algorithm breaks down the original problem into smaller subproblems.',
            type: QUESTION_TYPE.MULTIPLE_CHOICE,
            data: {
              question: 'How does the Merge Sort algorithm decompose the original sorting problem?',
              options: [
                'It selects a pivot element and partitions the array around it',
                'It divides the array in half regardless of the values',
                'It creates buckets based on value ranges',
                'It identifies already sorted subarrays'
              ],
              correctAnswer: 'It divides the array in half regardless of the values'
            },
            hints: [
              'Think about whether the algorithm considers the values when dividing the array',
              'Consider how the algorithm splits the original problem into subproblems',
              'In a divide-and-conquer approach, how is the "divide" step implemented?'
            ]
          },
          {
            id: STEP_TYPE.BASE_CASE,
            title: 'Base Case Identification',
            instructions: 'Now, identify the base case for the Merge Sort recursion. The base case is the simplest instance of the problem that can be solved directly without further recursion.',
            type: QUESTION_TYPE.MULTIPLE_CHOICE,
            data: {
              question: 'What is the base case for the Merge Sort algorithm?',
              options: [
                'An array of size 0',
                'An array of size 1',
                'An array of size 2',
                'A sorted array of any size'
              ],
              correctAnswer: 'An array of size 1'
            },
            hints: [
              'Think about what is the smallest array size that you can sort without recursion',
              'Consider when the recursion should stop dividing the array further',
              'What is the simplest case that can be solved directly?'
            ]
          },
          {
            id: STEP_TYPE.RECURRENCE,
            title: 'Recurrence Relation',
            instructions: 'In this step, identify the recurrence relation that describes the time complexity of the Merge Sort algorithm.',
            type: QUESTION_TYPE.MULTIPLE_CHOICE,
            data: {
              question: 'Which recurrence relation correctly describes the time complexity of Merge Sort?',
              options: [
                'T(n) = 2T(n/2) + O(n)',
                'T(n) = T(n/2) + O(1)',
                'T(n) = 2T(n/2) + O(log n)',
                'T(n) = T(n-1) + O(n)'
              ],
              correctAnswer: 'T(n) = 2T(n/2) + O(n)'
            },
            hints: [
              'The recurrence relation should express the time as a function of the input size',
              'Consider the number of recursive calls made and the work done at each level',
              'Think about the cost of the merge operation relative to the input size'
            ]
          },
          {
            id: STEP_TYPE.PSEUDOCODE,
            title: 'Pseudocode Translation',
            instructions: 'Now, write pseudocode for the Merge Sort algorithm. Make sure to include both the recursive Merge Sort function and the merge function that combines two sorted arrays.',
            type: QUESTION_TYPE.FREE_TEXT,
            data: {
              question: 'Write pseudocode for the Merge Sort algorithm, including the merge function:'
            },
            hints: [
              'Start with the main mergeSort function that takes an array parameter',
              'Consider how to merge two already sorted arrays efficiently',
              'Make sure your pseudocode handles all the cases, including the base case'
            ]
          }
        ]
      },
      {
        id: 'binary-search',
        title: 'Binary Search',
        difficulty: DIFFICULTY.BEGINNER,
        category: 'Searching',
        featured: true,
        estimatedTime: '15 mins',
        description: 'Binary Search is an efficient algorithm for finding an item in a sorted list. It works by repeatedly dividing the search interval in half, eliminating the half where the target cannot be. Your task is to understand the divide-and-conquer aspects of the Binary Search algorithm.',
        learningObjectives: [
          'Understand the prerequisites for binary search to work correctly',
          'Identify how to decompose the search problem',
          'Recognize the base cases for the algorithm',
          'Develop correct pseudocode for binary search'
        ],
        hints: [
          'Binary search only works on sorted data',
          'Think about what happens when you compare the middle element to your target',
          'Consider what conditions would terminate your search'
        ],
        steps: [
          {
            id: STEP_TYPE.DECOMPOSITION,
            title: 'Problem Decomposition',
            instructions: 'In the first step, you need to identify how Binary Search divides the problem into smaller subproblems.',
            type: QUESTION_TYPE.MULTIPLE_CHOICE,
            data: {
              question: 'How does Binary Search decompose the original search problem?',
              options: [
                'It searches the left half first, then the right half',
                'It compares the middle element and eliminates half of the remaining elements in each step',
                'It divides the array into equal thirds and searches each section',
                'It eliminates elements one by one from the beginning of the array'
              ],
              correctAnswer: 'It compares the middle element and eliminates half of the remaining elements in each step'
            },
            hints: [
              'Think about how the search space is reduced in each step',
              'Consider what information is used to determine which half to discard',
              'In a divide-and-conquer approach, the problem size should decrease significantly with each step'
            ]
          },
          {
            id: STEP_TYPE.BASE_CASE,
            title: 'Base Case Identification',
            instructions: 'Now, identify the base cases for Binary Search.',
            type: QUESTION_TYPE.MULTIPLE_CHOICE,
            data: {
              question: 'What are the base cases for Binary Search? (Select all that apply)',
              options: [
                'The middle element equals the target (found case)',
                'The search interval becomes empty (not found case)',
                'The array size becomes 1',
                'The left and right pointers cross each other'
              ],
              correctAnswer: ['The middle element equals the target (found case)', 'The search interval becomes empty (not found case)']
            },
            hints: [
              'Think about when the algorithm should terminate',
              'Consider both successful and unsuccessful search scenarios',
              'There should be at least two conditions that end the recursion'
            ]
          },
          {
            id: STEP_TYPE.RECURRENCE,
            title: 'Recurrence Relation',
            instructions: 'In this step, identify the recurrence relation that describes the time complexity of Binary Search.',
            type: QUESTION_TYPE.MULTIPLE_CHOICE,
            data: {
              question: 'Which recurrence relation correctly describes the time complexity of Binary Search?',
              options: [
                'T(n) = T(n/2) + O(1)',
                'T(n) = 2T(n/2) + O(1)',
                'T(n) = T(n/2) + O(n)',
                'T(n) = T(n-1) + O(1)'
              ],
              correctAnswer: 'T(n) = T(n/2) + O(1)'
            },
            hints: [
              'Think about how many recursive calls are made in each step',
              'Consider the amount of work done at each level of recursion',
              'Binary search should be more efficient than linear search'
            ]
          },
          {
            id: STEP_TYPE.PSEUDOCODE,
            title: 'Pseudocode Translation',
            instructions: 'Now, write pseudocode for the Binary Search algorithm.',
            type: QUESTION_TYPE.FREE_TEXT,
            data: {
              question: 'Write pseudocode for the Binary Search algorithm:'
            },
            hints: [
              'Make sure to define the search boundaries clearly',
              'Handle both recursive and iterative versions if possible',
              'Consider edge cases like an empty array or the target not being present'
            ]
          }
        ]
      },
      {
        id: 'maximum-subarray',
        title: 'Maximum Subarray',
        difficulty: DIFFICULTY.INTERMEDIATE,
        category: 'Arrays',
        featured: true,
        estimatedTime: '30 mins',
        description: 'The Maximum Subarray problem asks you to find the contiguous subarray with the largest sum within a given array. This problem can be efficiently solved using a divide-and-conquer approach.',
        learningObjectives: [
          'Understand how to decompose the maximum subarray problem',
          'Identify the base case for recursion',
          'Formulate a strategy for combining solutions to subproblems',
          'Implement the algorithm in pseudocode'
        ],
        hints: [
          'Consider how to handle the case where the maximum subarray crosses the midpoint',
          'The base case is typically a single-element array',
          'You need to consider three possible cases for the location of the maximum subarray'
        ],
        steps: [
          {
            id: STEP_TYPE.DECOMPOSITION,
            title: 'Problem Decomposition',
            instructions: 'In the first step, you need to identify how to decompose the Maximum Subarray problem.',
            type: QUESTION_TYPE.MULTIPLE_CHOICE,
            data: {
              question: 'How would you decompose the Maximum Subarray problem using divide-and-conquer?',
              options: [
                'Divide the array in half and find the maximum subarray entirely in the left half or right half',
                'Divide the array in half and find the maximum subarray that crosses the midpoint',
                'Both A and B, then take the maximum of the three cases',
                'Sort the array first, then find the maximum consecutive sum'
              ],
              correctAnswer: 'Both A and B, then take the maximum of the three cases'
            },
            hints: [
              'Think about all possible locations of the maximum subarray',
              'Consider that the maximum subarray might span across the division point',
              'A complete solution should not miss any potential maximum subarray'
            ]
          },
          {
            id: STEP_TYPE.BASE_CASE,
            title: 'Base Case Identification',
            instructions: 'Now, identify the base case for the Maximum Subarray problem.',
            type: QUESTION_TYPE.FILL_IN_BLANK,
            data: {
              question: 'Complete the base case for the Maximum Subarray algorithm:',
              questionText: 'If the array has [blank] element(s), the maximum subarray is the [blank] itself with sum equal to the [blank] of that element.',
              blanks: [
                ['1', 'one', 'a single'],
                ['element', 'array', 'subarray'],
                ['value', 'number']
              ]
            },
            hints: [
              'Think about the simplest possible array',
              'Consider when recursion should stop dividing the array',
              'The simplest case should be straightforward to solve directly'
            ]
          },
          {
            id: STEP_TYPE.RECURRENCE,
            title: 'Recurrence Relation',
            instructions: 'In this step, identify the recurrence relation that describes the time complexity of the Maximum Subarray algorithm.',
            type: QUESTION_TYPE.MULTIPLE_CHOICE,
            data: {
              question: 'Which recurrence relation correctly describes the time complexity of the Maximum Subarray algorithm?',
              options: [
                'T(n) = 2T(n/2) + O(n)',
                'T(n) = T(n/2) + O(1)',
                'T(n) = 2T(n/2) + O(log n)',
                'T(n) = T(n-1) + O(n)'
              ],
              correctAnswer: 'T(n) = 2T(n/2) + O(n)'
            },
            hints: [
              'Consider the recursive calls made at each step',
              'Think about the cost of finding the cross-boundary maximum subarray',
              'The overall time complexity involves both recursive calls and the combining step'
            ]
          },
          {
            id: STEP_TYPE.ALGORITHM_STEPS,
            title: 'Algorithm Steps',
            instructions: 'Put the steps of the Maximum Subarray algorithm in the correct order.',
            type: QUESTION_TYPE.DRAG_DROP,
            data: {
              question: 'Arrange the following steps of the Maximum Subarray algorithm in the correct order:',
              items: [
                'Divide the array into two halves',
                'Find the maximum subarray that crosses the midpoint',
                'Find the maximum subarray in the left half',
                'Find the maximum subarray in the right half',
                'Return the maximum of the three cases'
              ],
              correctOrder: [
                'Divide the array into two halves',
                'Find the maximum subarray in the left half',
                'Find the maximum subarray in the right half',
                'Find the maximum subarray that crosses the midpoint',
                'Return the maximum of the three cases'
              ]
            },
            hints: [
              'Think about the logical sequence of operations',
              'Follow the standard divide-and-conquer pattern',
              'Consider when the combining step should occur'
            ]
          },
          {
            id: STEP_TYPE.PSEUDOCODE,
            title: 'Pseudocode Translation',
            instructions: 'Now, write pseudocode for the Maximum Subarray algorithm.',
            type: QUESTION_TYPE.FREE_TEXT,
            data: {
              question: 'Write pseudocode for the Maximum Subarray algorithm, including the function to find the maximum subarray that crosses the midpoint:',
              validationKeywords: ['max', 'mid', 'left', 'right', 'cross', 'return']
            },
            hints: [
              'Include the main function and any helper functions',
              'Be sure to handle the cross-boundary case carefully',
              'Make sure your pseudocode reflects all three cases discussed earlier'
            ]
          }
        ]
      },
      {
        id: 'closest-pair',
        title: 'Closest Pair of Points',
        difficulty: DIFFICULTY.ADVANCED,
        category: 'Computational Geometry',
        featured: true,
        estimatedTime: '45 mins',
        description: 'Find the closest pair of points in a set of points in a 2D plane. The divide-and-conquer approach for this problem offers a more efficient solution than the naive brute force method. Your task is to understand how this geometric problem can be tackled using divide-and-conquer principles.',
        learningObjectives: [
          'Understand how to decompose a geometric problem',
          'Identify appropriate base cases for the recursion',
          'Formulate a strategy for combining solutions across the dividing line',
          'Implement the algorithm in pseudocode'
        ],
        hints: [
          'Consider the case where the closest pair spans across the dividing line',
          'Sorting points can help optimize the search',
          'The base case is typically handled with a brute force approach'
        ],
        steps: [
          {
            id: STEP_TYPE.DECOMPOSITION,
            title: 'Problem Decomposition',
            instructions: 'In the first step, you need to identify how to decompose the Closest Pair of Points problem.',
            type: QUESTION_TYPE.MULTIPLE_CHOICE,
            data: {
              question: 'How would you decompose the Closest Pair of Points problem using divide-and-conquer?',
              options: [
                'Divide the points into four quadrants and find the closest pair in each',
                'Divide the points by sorting them on x-coordinate and splitting into left and right halves',
                'Randomly select pairs of points and compare distances',
                'Sort points by both x and y coordinates and compare adjacent points'
              ],
              correctAnswer: 'Divide the points by sorting them on x-coordinate and splitting into left and right halves'
            },
            hints: [
              'Think about how to create a balanced division of the problem',
              'Consider which dimension is most useful for dividing the points',
              'The division should allow for efficient recombination later'
            ]
          },
          {
            id: STEP_TYPE.BASE_CASE,
            title: 'Base Case Identification',
            instructions: 'Now, identify the base case for the Closest Pair of Points problem.',
            type: QUESTION_TYPE.MULTIPLE_CHOICE,
            data: {
              question: 'What is the base case for the Closest Pair of Points algorithm?',
              options: [
                'A set with 0 or 1 point (no valid pair)',
                'A set with 2 points (direct distance calculation)',
                'A set with 3 points (compare all three pairs)',
                'A set with 2 or 3 points (use brute force)'
              ],
              correctAnswer: 'A set with 2 or 3 points (use brute force)'
            },
            hints: [
              'Think about when it becomes inefficient to divide further',
              'Consider when a direct brute force calculation is optimal',
              'The base case should be simple enough to solve directly'
            ]
          },
          {
            id: STEP_TYPE.RECURRENCE,
            title: 'Recurrence Relation',
            instructions: 'In this step, identify the recurrence relation that describes the time complexity of the Closest Pair of Points algorithm.',
            type: QUESTION_TYPE.MULTIPLE_CHOICE,
            data: {
              question: 'Which recurrence relation correctly describes the time complexity of the Closest Pair of Points algorithm?',
              options: [
                'T(n) = 2T(n/2) + O(n)',
                'T(n) = 2T(n/2) + O(n log n)',
                'T(n) = 2T(n/2) + O(n²)',
                'T(n) = 4T(n/4) + O(n)'
              ],
              correctAnswer: 'T(n) = 2T(n/2) + O(n)'
            },
            hints: [
              'Consider the cost of the divide step (sorting, if not pre-sorted)',
              'Think about the cost of checking points that span the dividing line',
              'The key insight is that only a limited number of cross-boundary points need checking'
            ]
          },
          {
            id: STEP_TYPE.ALGORITHM_STEPS,
            title: 'Strip Case Handling',
            instructions: 'The most challenging part of the Closest Pair algorithm is handling points that might form a closer pair across the dividing line.',
            type: QUESTION_TYPE.MULTIPLE_CHOICE,
            data: {
              question: 'After finding the minimum distance δ from the left and right halves, how do you efficiently check for closer pairs that cross the dividing line?',
              options: [
                'Check all possible pairs of points from left and right halves',
                'Create a strip of width 2δ centered on the dividing line, and check only points within this strip',
                'No need to check cross-boundary pairs as they are always farther than within-half pairs',
                'Sort all points by y-coordinate and check adjacent points only'
              ],
              correctAnswer: 'Create a strip of width 2δ centered on the dividing line, and check only points within this strip'
            },
            hints: [
              'Think about which points could possibly form a pair with distance less than the current minimum',
              'Consider geometric constraints to limit the search space',
              'The key efficiency comes from not having to check all cross-boundary pairs'
            ]
          },
          {
            id: STEP_TYPE.ALGORITHM_INSIGHT,
            title: 'Key Optimization',
            instructions: 'There is a critical optimization in the strip processing step that reduces the time complexity.',
            type: QUESTION_TYPE.MULTIPLE_CHOICE,
            data: {
              question: 'When checking points within the strip, what key optimization reduces the number of comparisons?',
              options: [
                'For each point, you only need to check at most 6 other points sorted by y-coordinate',
                'You can eliminate points that are more than δ apart in the y-direction',
                'Both A and B are correct optimizations',
                'You need to check all pairs of points in the strip'
              ],
              correctAnswer: 'Both A and B are correct optimizations'
            },
            hints: [
              'Think about geometric constraints in both x and y dimensions',
              'Consider how many points can fit in a δ × δ square',
              'Sorting by y-coordinate within the strip provides efficiency benefits'
            ]
          },
          {
            id: STEP_TYPE.PSEUDOCODE,
            title: 'Pseudocode Translation',
            instructions: 'Now, write pseudocode for the Closest Pair of Points algorithm.',
            type: QUESTION_TYPE.FREE_TEXT,
            data: {
              question: 'Write pseudocode for the Closest Pair of Points algorithm, including the function to handle the strip case:'
            },
            hints: [
              'Include preprocessing steps like sorting points by x-coordinate',
              'Handle the base case, recursive division, and strip checking',
              'Pay special attention to the strip processing optimization'
            ]
          }
        ]
      },
      {
        id: 'matrix-multiplication',
        title: 'Strassen\'s Matrix Multiplication',
        difficulty: DIFFICULTY.ADVANCED,
        category: 'Linear Algebra',
        featured: true,
        estimatedTime: '60 mins',
        description: 'Strassen\'s algorithm is a divide-and-conquer approach for multiplying matrices more efficiently than the standard method. While traditional matrix multiplication has a time complexity of O(n³), Strassen\'s algorithm achieves O(n^log₂7) ≈ O(n^2.81), making it asymptotically faster for large matrices.',
        learningObjectives: [
          'Understand how to decompose matrix multiplication',
          'Identify base cases for the recursion',
          'Apply algebraic transformations to reduce the number of recursive multiplications',
          'Implement the algorithm in pseudocode'
        ],
        hints: [
          'Standard matrix multiplication uses 8 recursive multiplications',
          'Strassen\'s algorithm reduces this to 7 multiplications',
          'The base case is typically small matrices that can be multiplied directly'
        ],
        steps: [
          {
            id: STEP_TYPE.DECOMPOSITION,
            title: 'Problem Decomposition',
            instructions: 'In the first step, you need to identify how Strassen\'s algorithm decomposes the matrix multiplication problem.',
            type: QUESTION_TYPE.MULTIPLE_CHOICE,
            data: {
              question: 'How does Strassen\'s algorithm decompose the matrix multiplication problem?',
              options: [
                'Divide each n×n matrix into four n/2×n/2 submatrices and perform operations on these blocks',
                'Split each matrix into rows and columns and multiply them independently',
                'Convert matrices into lower and upper triangular matrices, then multiply',
                'Transform matrices using Fourier transforms for faster multiplication'
              ],
              correctAnswer: 'Divide each n×n matrix into four n/2×n/2 submatrices and perform operations on these blocks'
            },
            hints: [
              'Think about dividing matrices into quadrants',
              'Consider how to express the problem in terms of smaller matrix multiplications',
              'The approach should reduce an n×n problem into smaller subproblems'
            ]
          },
          {
            id: STEP_TYPE.BASE_CASE,
            title: 'Base Case Identification',
            instructions: 'Now, identify the base case for Strassen\'s matrix multiplication algorithm.',
            type: QUESTION_TYPE.MULTIPLE_CHOICE,
            data: {
              question: 'What is the base case for Strassen\'s algorithm?',
              options: [
                'When the matrices are 1×1 (scalar multiplication)',
                'When the matrices are 2×2 (direct multiplication)',
                'When the matrix size is below a threshold (e.g., n ≤ 32), use standard multiplication',
                'When one matrix is the identity matrix'
              ],
              correctAnswer: 'When the matrix size is below a threshold (e.g., n ≤ 32), use standard multiplication'
            },
            hints: [
              'Think about practical implementations rather than theoretical purity',
              'Consider when the overhead of recursion outweighs the benefits',
              'Very small matrices can be multiplied more efficiently with standard methods'
            ]
          },
          {
            id: STEP_TYPE.RECURRENCE,
            title: 'Recurrence Relation',
            instructions: 'In this step, identify the recurrence relation that describes the time complexity of Strassen\'s algorithm.',
            type: QUESTION_TYPE.MULTIPLE_CHOICE,
            data: {
              question: 'Which recurrence relation correctly describes the time complexity of Strassen\'s algorithm?',
              options: [
                'T(n) = 8T(n/2) + O(n²)',
                'T(n) = 7T(n/2) + O(n²)',
                'T(n) = 7T(n/2) + O(n)',
                'T(n) = 4T(n/2) + O(n²)'
              ],
              correctAnswer: 'T(n) = 7T(n/2) + O(n²)'
            },
            hints: [
              'Consider the number of recursive multiplications in Strassen\'s method',
              'Think about the cost of matrix additions and subtractions needed',
              'The key innovation is reducing the number of recursive calls from 8 to 7'
            ]
          },
          {
            id: STEP_TYPE.ALGORITHM_INSIGHT,
            title: 'Strassen\'s Innovation',
            instructions: 'Understand the key innovation in Strassen\'s algorithm that makes it faster than standard matrix multiplication.',
            type: QUESTION_TYPE.MULTIPLE_CHOICE,
            data: {
              question: 'What is the key innovation in Strassen\'s algorithm that reduces the number of recursive multiplications from 8 to 7?',
              options: [
                'Using clever matrix additions and subtractions to compute the result with fewer multiplications',
                'Using parallel processing to compute multiple multiplications simultaneously',
                'Eliminating zero multiplications in sparse matrices',
                'Converting matrices to a different number system for faster calculation'
              ],
              correctAnswer: 'Using clever matrix additions and subtractions to compute the result with fewer multiplications'
            },
            hints: [
              'Think about algebraic transformations that can reduce multiplications',
              'The approach involves computing intermediate products that can be reused',
              'Addition and subtraction are less computationally expensive than multiplication'
            ]
          },
          // {
          //   id: STEP_TYPE.ALGORITHM_STEPS,
          //   title: 'Strassen\'s Seven Multiplications',
          //   instructions: 'Identify the seven matrix multiplications used in Strassen\'s algorithm.',
          //   type: QUESTION_TYPE.DRAG_DROP,
          //   data: {
          //     question: 'Match each of Strassen\'s seven products (P1-P7) with its correct formula:',
          //     items: [
          //       'P1 = A11 × (B12 - B22)',
          //       'P2 = (A11 + A12) × B22',
          //       'P3 = (A21 + A22) × B11',
          //       'P4 = A22 × (B21 - B11)',
          //       'P5 = (A11 + A22) × (B11 + B22)',
          //       'P6 = (A12 - A22) × (B21 + B22)',
          //       'P7 = (A11 - A21) × (B11 + B12)'
          //     ],
          //     correctOrder: [
          //       'P1 = A11 × (B12 - B22)',
          //       'P2 = (A11 + A12) × B22',
          //       'P3 = (A21 + A22) × B11',
          //       'P4 = A22 × (B21 - B11)',
          //       'P5 = (A11 + A22) × (B11 + B22)',
          //       'P6 = (A12 - A22) × (B21 + B22)',
          //       'P7 = (A11 - A21) × (B11 + B12)'
          //     ]
          //   },
          //   hints: [
          //     'Each product combines submatrices in a specific way',
          //     'The formulas are designed to be reused in computing the final result',
          //     'Memorizing these is less important than understanding the concept'
          //   ]
          // },
          {
            id: STEP_TYPE.PSEUDOCODE,
            title: 'Pseudocode Translation',
            instructions: 'Now, write pseudocode for Strassen\'s matrix multiplication algorithm.',
            type: QUESTION_TYPE.FREE_TEXT,
            data: {
              question: 'Write pseudocode for Strassen\'s matrix multiplication algorithm, including the base case and the calculation of the seven products:'
            },
            hints: [
              'Include the base case for small matrices',
              'Show how to divide matrices into quadrants',
              'Specify the seven products and how they combine to form the result',
              'Consider handling matrices whose dimensions aren\'t powers of 2'
            ]
          }
        ]
      },
      {
        id: 'quick-sort',
        title: 'Quick Sort',
        difficulty: DIFFICULTY.INTERMEDIATE,
        category: 'Sorting',
        featured: true,
        estimatedTime: '30 mins',
        description: 'Quick Sort is a divide-and-conquer sorting algorithm that works by selecting a pivot element from the array and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot. The sub-arrays are then sorted recursively.',
        learningObjectives: [
          'Understand how to select and use a pivot element',
          'Identify appropriate base cases for the recursion',
          'Analyze the time complexity under different scenarios',
          'Implement the algorithm in pseudocode'
        ],
        hints: [
          'Consider how different pivot selection strategies affect performance',
          'The base case is typically small arrays that can be sorted directly',
          'The partition step is the key to the algorithm\'s efficiency'
        ],
        steps: [
          {
            id: STEP_TYPE.DECOMPOSITION,
            title: 'Problem Decomposition',
            instructions: 'In the first step, you need to identify how Quick Sort decomposes the original sorting problem.',
            type: QUESTION_TYPE.MULTIPLE_CHOICE,
            data: {
              question: 'How does the Quick Sort algorithm decompose the original sorting problem?',
              options: [
                'It divides the array in half regardless of values',
                'It selects a pivot element and partitions the array into elements less than and greater than the pivot',
                'It identifies already sorted subarrays and merges them',
                'It divides the array into equal-sized buckets based on value ranges'
              ],
              correctAnswer: 'It selects a pivot element and partitions the array into elements less than and greater than the pivot'
            },
            hints: [
              'Think about how elements are grouped in each recursive step',
              'Consider what makes Quick Sort different from Merge Sort',
              'The pivot selection is a key aspect of this algorithm'
            ]
          },
          {
            id: STEP_TYPE.BASE_CASE,
            title: 'Base Case Identification',
            instructions: 'Now, identify the base case for the Quick Sort recursion.',
            type: QUESTION_TYPE.MULTIPLE_CHOICE,
            data: {
              question: 'What is the base case for the Quick Sort algorithm?',
              options: [
                'An array of size 0',
                'An array of size 1',
                'Either an array of size 0 or 1',
                'A sorted array of any size'
              ],
              correctAnswer: 'Either an array of size 0 or 1'
            },
            hints: [
              'Think about when an array is trivially sorted',
              'Consider when recursion should stop',
              'The base case should be simple enough to solve directly'
            ]
          },
          {
            id: STEP_TYPE.RECURRENCE,
            title: 'Recurrence Relation',
            instructions: 'In this step, identify the recurrence relation that describes the time complexity of Quick Sort in different scenarios.',
            type: QUESTION_TYPE.MULTIPLE_CHOICE,
            data: {
              question: 'Which recurrence relation correctly describes the time complexity of Quick Sort in the average case?',
              options: [
                'T(n) = 2T(n/2) + O(n)',
                'T(n) = T(n-1) + O(n)',
                'T(n) = T(n/4) + T(3n/4) + O(n)',
                'T(n) = 2T(n/2) + O(n log n)'
              ],
              correctAnswer: 'T(n) = 2T(n/2) + O(n)'
            },
            hints: [
              'In the average case, the pivot divides the array somewhat evenly',
              'Consider the cost of the partition operation',
              'The best case occurs when the pivot divides the array exactly in half'
            ]
          },
          {
            id: STEP_TYPE.ALGORITHM_INSIGHT,
            title: 'Pivot Selection',
            instructions: 'A critical aspect of Quick Sort is pivot selection, which significantly impacts performance.',
            type: QUESTION_TYPE.MULTIPLE_CHOICE,
            data: {
              question: 'Which pivot selection strategy generally provides the best average-case performance for Quick Sort?',
              options: [
                'Always choosing the first element as the pivot',
                'Always choosing the last element as the pivot',
                'Choosing a random element as the pivot',
                'Using the "median-of-three" approach (median of first, middle, and last elements)'
              ],
              correctAnswer: 'Using the "median-of-three" approach (median of first, middle, and last elements)'
            },
            hints: [
              'Think about which strategy minimizes the chance of worst-case partitioning',
              'Consider how the input array\'s initial ordering affects each strategy',
              'The ideal pivot would divide the array into equal halves'
            ]
          },
          {
            id: STEP_TYPE.ALGORITHM_STEPS,
            title: 'Partition Algorithm',
            instructions: 'The partition step is the most crucial part of Quick Sort. It rearranges the array and returns the pivot\'s final position.',
            type: QUESTION_TYPE.DRAG_DROP,
            data: {
              question: 'Arrange the following steps of the partition algorithm in the correct order:',
              items: [
                'Choose a pivot element',
                'Initialize left pointer to the start and right pointer to the end',
                'Move left pointer right until an element greater than pivot is found',
                'Move right pointer left until an element less than pivot is found',
                'Swap elements at left and right pointers if left < right',
                'Continue until pointers cross',
                'Swap pivot to its final position',
                'Return the pivot\'s final index'
              ],
              correctOrder: [
                'Choose a pivot element',
                'Initialize left pointer to the start and right pointer to the end',
                'Move left pointer right until an element greater than pivot is found',
                'Move right pointer left until an element less than pivot is found',
                'Swap elements at left and right pointers if left < right',
                'Continue until pointers cross',
                'Swap pivot to its final position',
                'Return the pivot\'s final index'
              ]
            },
            hints: [
              'This is Hoare\'s partition scheme',
              'The goal is to ensure all elements less than pivot are on one side',
              'Think about how to handle the termination condition'
            ]
          },
          {
            id: STEP_TYPE.PSEUDOCODE,
            title: 'Pseudocode Translation',
            instructions: 'Now, write pseudocode for the Quick Sort algorithm, including the partition function.',
            type: QUESTION_TYPE.FREE_TEXT,
            data: {
              question: 'Write pseudocode for the Quick Sort algorithm, including the partition function:'
            },
            hints: [
              'Include both the main QuickSort function and the partition function',
              'Consider edge cases such as empty arrays or single-element arrays',
              'Make sure your partition function correctly arranges elements around the pivot'
            ]
          }
        ]
      },
      // Additional problems would be defined here
    ],
    currentProblemId: null
  }),

  getters: {
    allProblems: (state) => state.problems,

    problemById: (state) => (id) => {
      return state.problems.find(p => p.id === id);
    },

    problemsByDifficulty: (state) => (difficulty) => {
      if (!difficulty) return state.problems;
      return state.problems.filter(p => p.difficulty === difficulty);
    },

    featuredProblems: (state) => {
      return state.problems.filter(p => p.featured === true);
    },

    currentProblem: (state) => {
      if (!state.currentProblemId) return null;
      return state.problems.find(p => p.id === state.currentProblemId);
    }
  },

  actions: {
    setCurrentProblem(id) {
      this.currentProblemId = id;
    }
  }
});