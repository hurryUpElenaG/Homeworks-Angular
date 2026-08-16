import { CurrencyPipe } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Stay } from '../../../core/models/stay.model';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { BadgeComponent } from '../badge/badge.component';
import { CardShellComponent } from '../card-shell/card-shell.component';

@Component({
  selector: 'app-stay-card',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatButtonModule,
    MatIconModule,
    TruncatePipe,
    BadgeComponent,
    CardShellComponent,
  ],
  templateUrl: './stay-card.component.html',
  styleUrl: './stay-card.component.css',
})
export class StayCardComponent {

  // Receives the stay from AppComponent
  stay = input.required<Stay>();

  // Sends the favorite information to AppComponent
  favorited = output<{
    id: number;
    favorited: boolean;
  }>();

  // Local favorite state for this card
  isFavorited = signal(false);

  toggleFavorite() {
    this.isFavorited.update(value => !value);

    this.favorited.emit({
      id: this.stay().id,
      favorited: this.isFavorited(),
    });
  }

  favoriteIcon() {
    return this.isFavorited()
      ? 'favorite'
      : 'favorite_border';
  }
}