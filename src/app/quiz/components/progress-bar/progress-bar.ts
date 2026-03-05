import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBar {
  @Input() current: number = 0;
  @Input() total: number | null = 0;

  get progressPercentage(): number {
    if (!this.total || this.total === 0) return 0;
    return (this.current / this.total) * 100;
  }
}
