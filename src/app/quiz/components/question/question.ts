import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  signal,
} from '@angular/core';
import { QuizQuestion, QuizAnswer } from '../../../core/models/quiz.model';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question.html',
  styleUrl: './question.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Question implements OnChanges {
  @Input() question: QuizQuestion | null = null;
  @Input() answer: QuizAnswer | null = null;
  @Output() answerChange = new EventEmitter<QuizAnswer>();

  private selectedOptionIds = signal<string[]>([]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['question'] || changes['answer']) {
      if (this.question && this.answer && this.answer.questionId === this.question.id) {
        this.selectedOptionIds.set([...this.answer.selectedOptionIds]);
      } else {
        this.selectedOptionIds.set([]);
      }
    }
  }

  isSelected(optionId: string): boolean {
    return this.selectedOptionIds().includes(optionId);
  }

  selectSingle(optionId: string): void {
    this.selectedOptionIds.set([optionId]);
    this.emitAnswer();
  }

  toggleMultiple(optionId: string): void {
    const current = this.selectedOptionIds();

    this.selectedOptionIds.set(
      current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId],
    );
    this.emitAnswer();
  }

  private emitAnswer(): void {
    if (!this.question) {
      return;
    }

    this.answerChange.emit({
      questionId: this.question.id,
      selectedOptionIds: this.selectedOptionIds(),
    });
  }
}
