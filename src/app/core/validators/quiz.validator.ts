import { QuizQuestion } from '../models/quiz.model';

export interface QuizValidationSummary {
  valid: QuizQuestion[];
  invalid: Array<{ question: unknown; errors: string[] }>;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export class QuizValidator {
  static validateQuestion(question: any): ValidationResult {
    const errors: string[] = [];

    if (!question.id || typeof question.id !== 'string') {
      errors.push('question needs id');
    }

    if (!question.type || !['single', 'multiple'].includes(question.type)) {
      errors.push('question type must be single or multiple');
    }

    if (!question.question || typeof question.question !== 'string') {
      errors.push('question text is missing');
    }

    if (!Array.isArray(question.options) || question.options.length === 0) {
      errors.push('options array is missing or empty');
    } else {
      const optionErrors = this.validateOptions(question.options, question.type);
      errors.push(...optionErrors);
    }

    if (typeof question.points !== 'number' || question.points < 0) {
      errors.push('points must be positive number');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private static validateOptions(options: any[], type: string): string[] {
    const errors: string[] = [];
    let correctCount = 0;

    options.forEach((option, index) => {
      if (!option.id || typeof option.id !== 'string') {
        errors.push(`option ${index + 1} needs id`);
      }

      if (!option.label || typeof option.label !== 'string') {
        errors.push(`option ${index + 1} needs label`);
      }

      if (typeof option.isCorrect !== 'boolean') {
        errors.push(`option ${index + 1} needs isCorrect boolean`);
      } else if (option.isCorrect) {
        correctCount++;
      }
    });

    if (type === 'single' && correctCount !== 1) {
      errors.push('single choice needs exactly 1 correct answer');
    }

    if (type === 'multiple' && correctCount === 0) {
      errors.push('multiple choice needs at least 1 correct answer');
    }

    return errors;
  }

  static validateQuizData(data: unknown): QuizValidationSummary {
    const valid: QuizQuestion[] = [];
    const invalid: Array<{ question: unknown; errors: string[] }> = [];

    if (!data || typeof data !== 'object') {
      return { valid, invalid };
    }

    const typedData = data as { questions?: unknown };

    if (!Array.isArray(typedData.questions)) {
      return { valid, invalid };
    }

    if (typedData.questions.length === 0) {
      return { valid, invalid };
    }

    typedData.questions.forEach((question) => {
      const result = this.validateQuestion(question as any);

      if (result.valid) {
        valid.push(question as QuizQuestion);
      } else {
        invalid.push({ question, errors: result.errors });
      }
    });

    return { valid, invalid };
  }
}
