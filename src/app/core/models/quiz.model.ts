export type QuestionType = 'single' | 'multiple';

export interface QuizOption {
  id: string;
  label: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options: QuizOption[];
  points: number;
}

export interface QuizData {
  questions: QuizQuestion[];
}

export interface UserInfo {
  name: string;
  email: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionIds: string[];
}

export interface QuizProgress {
  currentQuestionIndex: number;
  totalQuestions: number;
}

export interface QuizState {
  user: UserInfo | null;
  questions: QuizQuestion[];
  answers: { [questionId: string]: QuizAnswer };
  progress: QuizProgress;
  loading: boolean;
  error: string | null;
}

export interface QuizResult {
  userName: string;
  userEmail: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
}
