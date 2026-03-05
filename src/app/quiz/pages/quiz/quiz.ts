import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuizAnswer } from '../../../core/models/quiz.model';
import { QuizStore } from '../../store/quiz.store';
import { Question } from '../../components/question/question';
import { ProgressBar } from '../../components/progress-bar/progress-bar';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, Question, ProgressBar],
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Quiz implements OnInit {
  private quizStore = inject(QuizStore);
  private router = inject(Router);

  currentQuestion = this.quizStore.currentQuestion;
  currentAnswer = this.quizStore.currentAnswer;
  currentQuestionIndex = this.quizStore.currentQuestionIndex;
  totalQuestions = this.quizStore.totalQuestions;
  progressText = this.quizStore.progressText;
  isFirstQuestion = this.quizStore.isFirstQuestion;
  isLastQuestion = this.quizStore.isLastQuestion;
  error = this.quizStore.error;

  onAnswerChange(answer: QuizAnswer) {
    this.quizStore.saveAnswer(answer);
  }

  ngOnInit() {
    if (!this.quizStore.canStartQuiz()) {
      this.router.navigate(['/']);
      return;
    }

    this.quizStore.startQuiz();
  }

  onNext() {
    this.quizStore.goToNextQuestion();
  }

  onPrevious() {
    if (this.isFirstQuestion()) {
      this.router.navigate(['/']);
      return;
    }

    this.quizStore.goToPreviousQuestion();
  }

  onSubmit() {
    this.quizStore.submitQuiz();
    this.router.navigate(['/results']);
  }
}
