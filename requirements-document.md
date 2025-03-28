# Requirements Document: Divide-and-Conquer Tutor Prototype

## 1. Project Overview

### 1.1 Purpose
The Divide-and-Conquer Tutor is an educational web application designed to help computer science students learn and practice divide-and-conquer problem-solving techniques before jumping into coding. The system provides structured scaffolding through the pre-coding phase of algorithm development with AI-driven feedback.

### 1.2 Scope
This prototype will focus on teaching the fundamental components of divide-and-conquer algorithms:
- Problem decomposition 
- Base case identification
- Recurrence relation formulation
- Pseudocode translation

The application will include a bank of divide-and-conquer problems with varying difficulty levels and provide step-by-step guidance with real-time feedback.

### 1.3 Target Users
- Computer science students learning algorithm design
- Teaching assistants and instructors
- Self-learners studying algorithms

## 2. Functional Requirements

### 2.1 User Management
- **FR-1.1:** Users shall be able to create accounts and log in
- **FR-1.2:** Users shall have profiles that track their progress
- **FR-1.3:** Users shall be able to resume from where they left off

### 2.2 Problem Bank
- **FR-2.1:** The system shall maintain a bank of divide-and-conquer problems
- **FR-2.2:** Problems shall be categorized by difficulty (beginner, intermediate, advanced)
- **FR-2.3:** Each problem shall have a description, learning objectives, and expected outcomes
- **FR-2.4:** The initial problem set shall include at minimum:
  - Find maximum subarray
  - Merge sort
  - Quick sort
  - Binary search
  - Closest pair of points
  - Matrix multiplication (Strassen's algorithm)

### 2.3 Learning Flow
- **FR-3.1:** The system shall guide users through a structured learning process for each problem:
  - Step 1: Problem Decomposition
  - Step 2: Base Case Identification
  - Step 3: Recurrence Relation Formulation
  - Step 4: Pseudocode Translation
- **FR-3.2:** Users shall not be able to skip steps without demonstration of understanding
- **FR-3.3:** Users shall receive immediate feedback on their responses

### 2.4 Interactive Question Types
- **FR-4.1:** The system shall support various question formats:
  - Multiple choice questions
  - True/False questions
  - Fill-in-the-blank
  - Drag-and-drop ordering
  - Free-text responses for pseudocode
- **FR-4.2:** Each step in the learning flow shall use appropriate question types

### 2.5 AI-Driven Feedback
- **FR-5.1:** The system shall provide rule-based feedback for structured question types
- **FR-5.2:** The system shall implement Bayesian Knowledge Tracing to adjust problem difficulty
- **FR-5.3:** [Optional] The system shall use LLM-generated hints for free-form responses
- **FR-5.4:** Feedback shall be specific, constructive, and educational

### 2.6 Progress Tracking
- **FR-6.1:** The system shall track user performance metrics:
  - Completion rate
  - Accuracy rate
  - Response time
  - Number of attempts before correct answer
- **FR-6.2:** Users shall be able to view their progress over time
- **FR-6.3:** The system shall provide recommendations for what to study next

## 3. Non-Functional Requirements

### 3.1 Performance
- **NFR-1.1:** The application shall load within 2 seconds on standard broadband
- **NFR-1.2:** AI feedback shall be generated within 1 second for rule-based responses
- **NFR-1.3:** [If using LLM] LLM-generated feedback shall be provided within 5 seconds

### 3.2 Usability
- **NFR-2.1:** The interface shall be intuitive and accessible for users with no prior experience
- **NFR-2.2:** The application shall be responsive and function on desktop and tablet devices
- **NFR-2.3:** Error messages shall be clear and provide guidance on how to proceed
- **NFR-2.4:** The application shall have a clean, distraction-free design

### 3.3 Reliability
- **NFR-3.1:** The system shall have 99% uptime
- **NFR-3.2:** User progress shall be saved automatically after each interaction
- **NFR-3.3:** The system shall handle concurrent users without performance degradation

### 3.4 Security
- **NFR-4.1:** User credentials shall be stored securely using industry-standard practices
- **NFR-4.2:** All communications shall be encrypted using HTTPS
- **NFR-4.3:** The application shall implement protection against common web vulnerabilities

### 3.5 Maintainability
- **NFR-5.1:** The codebase shall follow consistent coding standards
- **NFR-5.2:** The application shall be modular to allow for easy extension of problem sets
- **NFR-5.3:** The system shall include comprehensive documentation

## 4. Technical Architecture

### 4.1 Frontend
- **TECH-1.1:** Vue 3 framework for the user interface
- **TECH-1.2:** [Optional] Nuxt for server-side rendering and improved SEO
- **TECH-1.3:** Responsive design using Tailwind CSS
- **TECH-1.4:** State management using Pinia or Vuex

### 4.2 Backend
- **TECH-2.1:** Node.js with Express for API services
- **TECH-2.2:** MongoDB for user data and progress tracking
- **TECH-2.3:** Redis for caching and session management

### 4.3 AI Components
- **TECH-3.1:** Rule-based engine for structured feedback
- **TECH-3.2:** Bayesian Knowledge Tracing implementation
- **TECH-3.3:** [Optional] OpenAI API integration for LLM-based hints

### 4.4 Deployment
- **TECH-4.1:** Docker containerization for consistent environments
- **TECH-4.2:** CI/CD pipeline for automated testing and deployment
- **TECH-4.3:** Cloud deployment (AWS, GCP, or Azure)

## 5. User Interface Requirements

### 5.1 Main Dashboard
- **UI-1.1:** Display user progress overview
- **UI-1.2:** Show recommended problems based on skill level
- **UI-1.3:** Provide access to problem categories

### 5.2 Problem Selection Interface
- **UI-2.1:** List available problems with difficulty indicators
- **UI-2.2:** Show completion status for each problem
- **UI-2.3:** Display brief problem descriptions

### 5.3 Learning Flow Interface
- **UI-3.1:** Clear indication of current step in the learning process
- **UI-3.2:** Consistent layout for different question types
- **UI-3.3:** Visual feedback for correct/incorrect responses
- **UI-3.4:** Access to relevant hints

### 5.4 Progress Review Interface
- **UI-4.1:** Visual representation of learning progress
- **UI-4.2:** Detailed breakdown of performance by problem type
- **UI-4.3:** Identification of areas needing improvement

## 6. Data Requirements

### 6.1 User Data
- **DATA-1.1:** User profile information
- **DATA-1.2:** Authentication credentials
- **DATA-1.3:** Progress tracking metrics

### 6.2 Problem Data
- **DATA-2.1:** Problem descriptions and metadata
- **DATA-2.2:** Step-by-step questions for each problem
- **DATA-2.3:** Expected answers and validation rules
- **DATA-2.4:** Hint library for each question

### 6.3 Performance Data
- **DATA-3.1:** Response accuracy statistics
- **DATA-3.2:** Time-to-completion metrics
- **DATA-3.3:** Learning curve data for knowledge tracing

## 7. Constraints and Limitations

### 7.1 Development Constraints
- **CON-1.1:** Initial prototype to be completed within [timeframe]
- **CON-1.2:** Limited to a defined set of problems for the prototype phase
- **CON-1.3:** Focus on core functionality before implementing advanced AI features

### 7.2 Technical Limitations
- **CON-2.1:** LLM response times may create latency for complex feedback
- **CON-2.2:** Initial BKT implementation may require calibration with user data
- **CON-2.3:** Free-text pseudocode validation has inherent limitations in accuracy

## 8. Future Enhancements

### 8.1 Expanded Problem Set
- **FUT-1.1:** Additional divide-and-conquer problems
- **FUT-1.2:** Extension to other algorithm paradigms (dynamic programming, greedy algorithms)

### 8.2 Advanced AI Features
- **FUT-2.1:** Personalized learning paths based on performance
- **FUT-2.2:** More sophisticated code validation
- **FUT-2.3:** Natural language explanation generation

### 8.3 Collaboration Features
- **FUT-3.1:** Peer review capabilities
- **FUT-3.2:** Discussion forums for problems
- **FUT-3.3:** Instructor dashboard for classroom use

## 9. Glossary

- **Divide-and-Conquer:** An algorithm design paradigm that breaks problems into smaller subproblems, solves them, and combines the solutions.
- **Base Case:** The simplest instance of a problem that can be solved directly without further recursion.
- **Recurrence Relation:** A mathematical equation that defines how solutions to subproblems combine to form the solution to the original problem.
- **Bayesian Knowledge Tracing (BKT):** A statistical model that estimates a student's knowledge state and predicts future performance.
