import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { QuizValidator, QuizValidationSummary } from '../../core/validators/quiz.validator';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private readonly quizDataUrl = 'assets/quiz.json';
  private readonly http = inject(HttpClient);

  loadQuiz(): Observable<QuizValidationSummary> {
    return this.http.get<unknown>(this.quizDataUrl).pipe(
      map((data) => QuizValidator.validateQuizData(data)),
      map((result) => {
        if (result.invalid.length > 0) {
          console.warn('some questions are invalid:', result.invalid);
        }
        return result;
      }),
      catchError((error) => {
        console.error('error loading quiz:', error);
        const emptyResult: QuizValidationSummary = { valid: [], invalid: [] };
        return of(emptyResult);
      }),
    );
  }
}
