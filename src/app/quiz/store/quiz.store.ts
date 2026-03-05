import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { computed } from '@angular/core';
import { QuizState, UserInfo, QuizAnswer, QuizResult } from '../../core/models/quiz.model';
import { QuizValidationSummary } from '../../core/validators/quiz.validator';

const initialState: QuizState = {
  user: null,
  questions: [],
  answers: {},
  progress: {
    currentQuestionIndex: 0,
    totalQuestions: 0,
  },
  loading: false,
  error: null,
};

export const QuizStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ user, questions, answers, progress, loading }) => ({
    currentQuestion: computed(() => questions()[progress().currentQuestionIndex]),
    currentAnswer: computed(() => {
      const currentQ = questions()[progress().currentQuestionIndex];
      return currentQ ? answers()[currentQ.id] : null;
    }),
    currentQuestionIndex: computed(() => progress().currentQuestionIndex),
    totalQuestions: computed(() => progress().totalQuestions),
    progressText: computed(
      () => `Question ${progress().currentQuestionIndex + 1} of ${progress().totalQuestions}`,
    ),
    isFirstQuestion: computed(() => progress().currentQuestionIndex === 0),
    isLastQuestion: computed(
      () => progress().currentQuestionIndex === progress().totalQuestions - 1,
    ),
    isUserInfoComplete: computed(() => !!(user()?.name && user()?.email)),
    canStartQuiz: computed(() => {
      const userComplete = !!(user()?.name && user()?.email);
      return userComplete && questions().length > 0 && !loading();
    }),
    quizResult: computed((): QuizResult | null => {
      const currentUser = user();
      if (!currentUser) return null;

      let totalScore = 0;
      let maxScore = 0;

      questions().forEach((question) => {
        maxScore += question.points;

        const answer = answers()[question.id];
        if (!answer) return;

        const correctIds = question.options
          .filter((opt) => opt.isCorrect)
          .map((opt) => opt.id)
          .sort();

        const selectedIds = [...answer.selectedOptionIds].sort();

        const isCorrect =
          correctIds.length === selectedIds.length &&
          correctIds.every((id, index) => id === selectedIds[index]);

        if (isCorrect) {
          totalScore += question.points;
        }
      });

      return {
        userName: currentUser.name,
        userEmail: currentUser.email,
        totalScore,
        maxScore,
        percentage: maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0,
      };
    }),
  })),
  withMethods((store) => ({
    setUserName(name: string) {
      patchState(store, (state) => ({
        user: {
          ...(state.user ?? { name: '', email: '' }),
          name,
        },
      }));
    },
    setUserInfo(user: UserInfo) {
      patchState(store, { user });
    },

    loadQuiz() {
      patchState(store, { loading: true, error: null });
    },
    loadQuizSuccess(data: QuizValidationSummary) {
      patchState(store, (state) => ({
        questions: data.valid,
        loading: false,
        error:
          data.invalid.length > 0
            ? `${data.invalid.length} question(s) skipped due to errors`
            : null,
        progress: {
          ...state.progress,
          totalQuestions: data.valid.length,
        },
      }));
    },
    loadQuizFailure(error: string) {
      patchState(store, { loading: false, error });
    },

    goToNextQuestion() {
      patchState(store, (state) => ({
        progress: {
          ...state.progress,
          currentQuestionIndex: Math.min(
            state.progress.currentQuestionIndex + 1,
            state.questions.length - 1,
          ),
        },
      }));
    },
    goToPreviousQuestion() {
      patchState(store, (state) => ({
        progress: {
          ...state.progress,
          currentQuestionIndex: Math.max(state.progress.currentQuestionIndex - 1, 0),
        },
      }));
    },
    goToQuestion(index: number) {
      patchState(store, (state) => ({
        progress: {
          ...state.progress,
          currentQuestionIndex: Math.max(0, Math.min(index, state.questions.length - 1)),
        },
      }));
    },

    saveAnswer(answer: QuizAnswer) {
      patchState(store, (state) => ({
        answers: {
          ...state.answers,
          [answer.questionId]: answer,
        },
      }));
    },
    clearAnswer(questionId: string) {
      const newAnswers = { ...store.answers() };
      delete newAnswers[questionId];
      patchState(store, { answers: newAnswers });
    },

    startQuiz() {
      patchState(store, (state) => ({
        progress: {
          ...state.progress,
          currentQuestionIndex: 0,
        },
      }));
    },
    resetQuiz() {
      patchState(store, initialState);
    },
    submitQuiz() {
      console.log('Quiz submitted:', store.answers());
    },
  })),
);
