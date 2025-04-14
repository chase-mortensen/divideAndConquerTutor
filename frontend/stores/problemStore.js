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
          'Think about what is the smallest array size that you can sort without recursion',
          'Consider how to merge two already sorted arrays efficiently',
          'The recurrence relation should express the time as a function of the input size'
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
            }
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
            }
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
            }
          },
          {
            id: STEP_TYPE.PSEUDOCODE,
            title: 'Pseudocode Translation',
            instructions: 'Now, write pseudocode for the Merge Sort algorithm. Make sure to include both the recursive Merge Sort function and the merge function that combines two sorted arrays.',
            type: QUESTION_TYPE.FREE_TEXT,
            data: {
              question: 'Write pseudocode for the Merge Sort algorithm, including the merge function:'
            }
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
            }
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
            }
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
            }
          },
          {
            id: STEP_TYPE.PSEUDOCODE,
            title: 'Pseudocode Translation',
            instructions: 'Now, write pseudocode for the Binary Search algorithm.',
            type: QUESTION_TYPE.FREE_TEXT,
            data: {
              question: 'Write pseudocode for the Binary Search algorithm:'
            }
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
            }
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
            }
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
            }
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
            }
          },
          {
            id: STEP_TYPE.PSEUDOCODE,
            title: 'Pseudocode Translation',
            instructions: 'Now, write pseudocode for the Maximum Subarray algorithm.',
            type: QUESTION_TYPE.FREE_TEXT,
            data: {
              question: 'Write pseudocode for the Maximum Subarray algorithm, including the function to find the maximum subarray that crosses the midpoint:',
              validationKeywords: ['max', 'mid', 'left', 'right', 'cross', 'return']
            }
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
        description: 'Find the closest pair of points in a set of points in a 2D plane.',
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
        steps: []
      },
      {
        id: 'matrix-multiplication',
        title: 'Strassen\'s Matrix Multiplication',
        difficulty: DIFFICULTY.ADVANCED,
        category: 'Linear Algebra',
        featured: true,
        estimatedTime: '60 mins',
        description: 'Implement Strassen\'s algorithm for multiplying matrices more efficiently.',
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
        steps: []
      },
      {
        id: 'quick-sort',
        title: 'Quick Sort',
        difficulty: DIFFICULTY.INTERMEDIATE,
        category: 'Sorting',
        featured: true,
        estimatedTime: '30 mins',
        description: 'Implement the quick sort algorithm using a pivot-based approach.',
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
        steps: []
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