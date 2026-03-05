import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./quiz/pages/user-info/user-info').then((c) => c.UserInfo),
  },
  {
    path: 'quiz',
    loadComponent: () => import('./quiz/pages/quiz/quiz').then((c) => c.Quiz),
  },
  {
    path: 'results',
    loadComponent: () => import('./quiz/pages/results/results').then((c) => c.Results),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
