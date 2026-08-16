import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
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

  stay = input.required<Stay>();

  // Parent tells the card whether this stay is favorited
  favorite = input(false);

  // Child tells parent that the favorite button was clicked
  favorited = output<number>();

  toggleFavorite() {
    this.favorited.emit(this.stay().id);
  }
}