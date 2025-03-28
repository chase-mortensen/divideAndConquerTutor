import { defineStore } from 'pinia';

export const useProblemStore = defineStore('problems', {
  state: () => ({
    problems: [
      {
        id: 'merge-sort',
        title: 'Merge Sort',
        difficulty: 'Beginner',
        category: 'Sorting',
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
            id: 'decomposition',
            title: 'Problem Decomposition',
            instructions: 'In the first step, you need to identify how the Merge Sort algorithm breaks down the original problem into smaller subproblems.',
            type: 'multiple-choice',
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
            id: 'base-case',
            title: 'Base Case Identification',
            instructions: 'Now, identify the base case for the Merge Sort recursion. The base case is the simplest instance of the problem that can be solved directly without further recursion.',
            type: 'multiple-choice',
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
            id: 'recurrence',
            title: 'Recurrence Relation',
            instructions: 'In this step, identify the recurrence relation that describes the time complexity of the Merge Sort algorithm.',
            type: 'multiple-choice',
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
            id: 'pseudocode',
            title: 'Pseudocode Translation',
            instructions: 'Now, write pseudocode for the Merge Sort algorithm. Make sure to include both the recursive Merge Sort function and the merge function that combines two sorted arrays.',
            type: 'free-text',
            data: {
              question: 'Write pseudocode for the Merge Sort algorithm, including the merge function:',
              validateFunc: (answer) => {
                // This is a simplified validator for demo purposes
                // In a real application, this would be more sophisticated
                const lowerAnswer = answer.toLowerCase();
                return lowerAnswer.includes('mergesort') && 
                      lowerAnswer.includes('merge') && 
                      lowerAnswer.includes('if') && 
                      (lowerAnswer.includes('length') || lowerAnswer.includes('size')) &&
                      lowerAnswer.includes('return');
              }
            }
          }
        ]
      },
      {
        id: 'binary-search',
        title: 'Binary Search',
        difficulty: 'Beginner',
        category: 'Searching',
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
            id: 'decomposition',
            title: 'Problem Decomposition',
            instructions: 'In the first step, you need to identify how Binary Search divides the problem into smaller subproblems.',
            type: 'multiple-choice',
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
            id: 'base-case',
            title: 'Base Case Identification',
            instructions: 'Now, identify the base cases for Binary Search.',
            type: 'multiple-choice',
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
            id: 'recurrence',
            title: 'Recurrence Relation',
            instructions: 'In this step, identify the recurrence relation that describes the time complexity of Binary Search.',
            type: 'multiple-choice',
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
            id: 'pseudocode',
            title: 'Pseudocode Translation',
            instructions: 'Now, write pseudocode for the Binary Search algorithm.',
            type: 'free-text',
            data: {
              question: 'Write pseudocode for the Binary Search algorithm:',
              validateFunc: (answer) => {
                const lowerAnswer = answer.toLowerCase();
                return lowerAnswer.includes('mid') && 
                      (lowerAnswer.includes('left') || lowerAnswer.includes('low')) && 
                      (lowerAnswer.includes('right') || lowerAnswer.includes('high')) && 
                      lowerAnswer.includes('if') && 
                      lowerAnswer.includes('return');
              }
            }
          }
        ]
      },
      {
        id: 'maximum-subarray',
        title: 'Maximum Subarray',
        difficulty: 'Intermediate',
        category: 'Arrays',
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
            id: 'decomposition',
            title: 'Problem Decomposition',
            instructions: 'In the first step, you need to identify how to decompose the Maximum Subarray problem.',
            type: 'multiple-choice',
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
          // Other steps would follow the same pattern as the previous problems
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