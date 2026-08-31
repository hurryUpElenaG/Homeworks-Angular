import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { Stay } from '../../../core/models/stay.model';
import { BadgeComponent } from '../badge/badge.component';
import { CardShellComponent } from '../card-shell/card-shell.component';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { CurrencyPipe } from '@angular/common';
import { HighlightCardDirective } from '../../directives/highlight-card.directive';

@Component({
  selector: 'app-stay-card',
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule,
    MatButtonModule,
    BadgeComponent,
    CardShellComponent,
    TruncatePipe,
    HighlightCardDirective,
    CurrencyPipe
  ],
  templateUrl: './stay-card.component.html',
  styleUrl: './stay-card.component.css',
})
export class StayCardComponent {

  // Parent gives the card a Stay object.
  // Signal input → read it with stay()
  stay = input.required<Stay>();

  // Parent tells the card whether this stay is currently favorited.
  // Default value is false.
  favorite = input(false);

  // Child tells the parent that the favorite button was clicked.
  // It sends the stay ID.
  favorited = output<number>();

  toggleFavorite(): void {
    this.favorited.emit(this.stay().id);
  }
}