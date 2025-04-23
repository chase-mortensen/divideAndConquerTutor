// Constants for use throughout the frontend application

// Difficulty Levels (FR-2.2)
export const DIFFICULTY = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
} as const; // Use 'as const' for type safety

export type DifficultyLevel = typeof DIFFICULTY[keyof typeof DIFFICULTY];

// Step Types (Pedagogical) (FR-3.1 / DATA-4.1 / BKT)
export const STEP_TYPE = {
  DECOMPOSITION: 'decomposition',
  BASE_CASE: 'base-case',
  RECURRENCE: 'recurrence',
  PSEUDOCODE: 'pseudocode',
  ALGORITHM_STEPS: 'algorithm-steps', // Used in problemStore, maps to PSEUDOCODE in getStepType
  ALGORITHM_INSIGHT: 'algorithm-insight', // Optional, used sparingly for miscellaneous insights
} as const;

export type PedagogicalStepType = typeof STEP_TYPE[keyof typeof STEP_TYPE];

// Question Types (Interactive Component Types) (FR-4.1)
export const QUESTION_TYPE = {
  MULTIPLE_CHOICE: 'multiple-choice',
  TRUE_FALSE: 'true-false',
  FILL_IN_BLANK: 'fill-in-blank',
  DRAG_DROP: 'drag-drop',
  FREE_TEXT: 'free-text',
} as const;

export type InteractiveQuestionType = typeof QUESTION_TYPE[keyof typeof QUESTION_TYPE];

// Progress Status (Used in progress.vue)
export const PROGRESS_STATUS = {
  COMPLETED: 'Completed',
  IN_PROGRESS: 'In Progress',
  NOT_STARTED: 'Not Started',
} as const;

export type ProgressStatusType = typeof PROGRESS_STATUS[keyof typeof PROGRESS_STATUS];