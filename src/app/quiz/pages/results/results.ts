import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuizStore } from '../../store/quiz.store';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.html',
  styleUrl: './results.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Results {
  private quizStore = inject(QuizStore);
  private router = inject(Router);

  result = this.quizStore.quizResult;

  onRestart() {
    this.quizStore.resetQuiz();
    this.router.navigate(['/']);
  }

  goToStart() {
    this.router.navigate(['/']);
  }
}
