export type Board = 'CBSE' | 'ICSE' | 'ISC' | 'WBCHSE';
export type Grade = 7 | 8 | 9 | 10 | 11 | 12;
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
export type Topic = 
  | 'Mechanics' 
  | 'Waves & Optics' 
  | 'Electricity & Magnetism' 
  | 'Thermodynamics' 
  | 'Modern Physics' | 'Optics' | 'Electromagnetism' | 'Waves & Thermodynamics' | 'Nuclear Physics';

export interface SimulationParameter {
  id: string;
  label: string;
  variableSymbol: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
  category?: 'physical' | 'initial_conditions' | 'environment';
  description?: string;
  options?: { value: number; label: string }[];
}

export interface EquationTemplate {
  id: string;
  title: string;
  latexFormula: string;
  description: string;
  // Function to format equation with real-time numeric substitution
  evaluator: (params: Record<string, number>) => {
    substitutedLatex: string;
    resultLabel: string;
    resultValue: number | string;
    resultUnit: string;
  };
}

export interface GuidedStep {
  stepNumber: number;
  title: string;
  instruction: string;
  targetParameterId?: string;
  targetValue?: number;
  observationPrompt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xpReward: number;
}

export interface SimulationConfig {
  id: string;
  title: string;
  subtitle: string;
  topic: Topic;
  subtopic: string;
  grade: Grade[];
  boards: Board[];
  difficulty: Difficulty;
  isInteractive: boolean;
  learningObjectives: string[];
  prerequisites: string[];
  realWorldApps: {
    title: string;
    description: string;
    icon?: string;
  }[];
  parameters: SimulationParameter[];
  equations: EquationTemplate[];
  guidedSteps?: GuidedStep[];
  quiz?: QuizQuestion[];
}

export interface SavedScenario {
  id: string;
  simulationId: string;
  title: string;
  notes: string;
  timestamp: string;
  params: Record<string, number>;
}
