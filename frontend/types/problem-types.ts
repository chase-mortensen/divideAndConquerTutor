// Type definitions based on requirements-document.md

// Based on DATA-4.2: Hint progression structure
export interface Hint {
  hintId: string;
  level: number; // 1 for gentle nudge, 5 for explicit guidance
  content: string;
  triggerConditions?: string[]; // Optional: incorrect patterns that trigger this hint
  nextHintDelay?: number; // Optional: seconds before next hint becomes available
}

// Define supported question types based on FR-4.1 and existing components/store data
export type QuestionType =
  | 'multiple-choice'
  | 'true-false' // Mentioned in FR-4.1
  | 'fill-in-blank'
  | 'drag-drop'
  | 'free-text';

// Define base Question structure.
// The 'data' property will hold type-specific details (options, answers, etc.)
// Using 'any' for data initially; can be refined later with discriminated unions or generics.
export interface Question {
  questionId: string; // Added for potential unique identification
  questionText: string; // The main text/prompt of the question
  questionType: QuestionType; // The type determining how the question is rendered and validated
  data: any; // Type-specific data (e.g., { options: string[], correctAnswer: string | string[] } for MC)
  hints?: Hint[]; // Specific hints related to this question
}

// Define supported step types based on FR-3.1 / DATA-4.1
export type StepType =
  | 'decomposition'
  | 'baseCase'
  | 'recurrence'
  | 'pseudocode';

// Based on DATA-4.1: Problem Structure Schema (steps array)
// Incorporates fields observed in current store data like title, instructions.
// NOTE: Requirements specify `questions: Question[]` within a step.
// Current implementation has `type` (QuestionType) and `data` (Question['data']) directly on the step.
// This definition follows the requirements doc; refactoring store/components might be needed later.
export interface Step {
  stepId: string; // Unique ID for the step within the problem (e.g., 'decomposition', 'base-case-1')
  stepType: StepType; // The pedagogical type of the step
  title: string; // Display title for the step
  instructions: string; // Instructions for the user for this step
  questions: Question[]; // Array of questions presented in this step
  hints?: Hint[]; // General hints applicable to this step
}

// Define difficulty levels based on FR-2.2
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

// Based on DATA-4.1: Problem Structure Schema and DATA-4.3: Required metadata
// Incorporates fields observed in current store data like category, estimatedTime.
export interface Problem {
  id: string; // Unique slug/ID for the problem (e.g., 'merge-sort')
  title: string; // Display title of the problem
  difficulty: Difficulty; // Difficulty level
  category?: string; // Problem category (e.g., 'Sorting', 'Searching') - from store data
  description: string; // Problem description text
  learningObjectives: string[]; // List of learning objectives
  expectedOutcomes: string[]; // List of expected outcomes (from requirements)
  steps: Step[]; // Array of steps for the learning flow
  // Note: Problem-level hints in store are string[]. Requirements don't specify top-level hints.
  // Using string[] for now to match store usage potentially by AdaptiveFeedback.
  // Could be refactored to use Hint[] or be step-specific later.
  hints?: string[];
  relatedProblems?: string[]; // IDs of related problems (from requirements)
  tags?: string[]; // Keywords/tags for categorization (from requirements)
  // Metadata from DATA-4.3
  timeEstimate?: string; // Estimated completion time string (e.g., '20 mins') - from store data / requirements
  prerequisiteKnowledge?: string[]; // List of prerequisites (from requirements)
  complexityAnalysis?: { time?: string; space?: string }; // Complexity info (from requirements)
  realWorldApplications?: string[]; // Examples of applications (from requirements)
  commonMisconceptions?: string[]; // Common pitfalls (from requirements)
}