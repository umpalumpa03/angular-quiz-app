import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { QuizStore } from '../../quiz/store/quiz.store';

export const resultsGuard: CanActivateFn = () => {
  const quizStore = inject(QuizStore);
  const router = inject(Router);

  if (!quizStore.quizResult()) {
    router.navigate(['/']);
    return false;
  }

  return true;
};