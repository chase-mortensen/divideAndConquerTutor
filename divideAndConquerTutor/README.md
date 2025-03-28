# Divide-and-Conquer Tutor

An educational web application designed to help computer science students learn and practice divide-and-conquer problem-solving techniques before jumping into coding. The system provides structured scaffolding through the pre-coding phase of algorithm development with AI-driven feedback.

## Features

- Step-by-step guidance through divide-and-conquer problem solving:
  - Problem Decomposition
  - Base Case Identification
  - Recurrence Relation Formulation
  - Pseudocode Translation
- Multiple problem types with varying difficulty levels
- Interactive question formats (multiple choice, free text)
- Progress tracking and skill mastery visualization
- Personalized feedback

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/divide-and-conquer-tutor.git
cd divide-and-conquer-tutor
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
divide-and-conquer-tutor/
├── assets/           # Static assets (CSS, images)
├── components/       # Vue components
├── layouts/          # Page layouts
├── pages/            # Application pages
├── stores/           # Pinia stores for state management
├── public/           # Public static assets
├── nuxt.config.ts    # Nuxt configuration
└── README.md         # This file
```

## Technologies Used

- Vue 3 + Nuxt 3: Frontend framework
- Pinia: State management
- Tailwind CSS + DaisyUI: Styling
- Node.js: Runtime environment

## Development

### Commands

- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run generate`: Generate a static version of the application
- `npm run preview`: Preview the production build locally

## Future Plans

- Integration with authentication system
- Expanded problem bank
- Advanced AI-driven feedback using LLMs
- Instructor dashboard for classroom use
- Peer review capabilities