import { Routes } from '@angular/router';
import { quizGuard } from './core/guards/quiz.guard';
import { resultsGuard } from './core/guards/results.guard';
import { UserInfo } from './quiz/pages/user-info/user-info';

export const routes: Routes = [
  {
    path: '',
    component: UserInfo,
  },
  {
    path: 'quiz',
    canActivate: [quizGuard],
    loadComponent: () =>
      import('./quiz/pages/quiz/quiz').then((c) => c.Quiz),
  },
  {
    path: 'results',
    canActivate: [resultsGuard],
    loadComponent: () =>
      import('./quiz/pages/results/results').then((c) => c.Results),
  },
  {
    path: '**',
    redirectTo: '',
  },
];