import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [class.card-hover]="hover">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() hover: boolean = false;
}