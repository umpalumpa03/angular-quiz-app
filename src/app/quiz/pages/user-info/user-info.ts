import { ChangeDetectionStrategy, Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuizStore } from '../../store/quiz.store';
import { QuizService } from '../../services/quiz.service';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-info.html',
  styleUrl: './user-info.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInfo implements OnInit {
  private quizStore = inject(QuizStore);
  private router = inject(Router);
  private quizService = inject(QuizService);

  currentStep = signal(1);

  name = signal('');
  email = signal('');

  nameTouched = signal(false);
  emailTouched = signal(false);

  isNameValid = computed(() => this.name().trim().length > 0);
  isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email()));
  isFormValid = computed(() => this.isNameValid() && this.isEmailValid());

  loading = this.quizStore.loading;
  error = this.quizStore.error;

  ngOnInit() {
    this.loadQuizData();
  }

  private loadQuizData() {
    this.quizStore.loadQuiz();
    this.quizService.loadQuiz().subscribe({
      next: (result) => {
        this.quizStore.loadQuizSuccess(result);
      },
    });
  }

  nextStep(): void {
    this.nameTouched.set(true);

    if (this.isNameValid()) {
      this.quizStore.setUserName(this.name());
      this.currentStep.set(2);
    }
  }

  previousStep(): void {
    this.currentStep.set(1);
  }

  submit(): void {
    this.emailTouched.set(true);

    if (!this.isFormValid()) return;

    this.quizStore.setUserInfo({
      name: this.name(),
      email: this.email(),
    });

    this.router.navigate(['/quiz']);
  }
}
