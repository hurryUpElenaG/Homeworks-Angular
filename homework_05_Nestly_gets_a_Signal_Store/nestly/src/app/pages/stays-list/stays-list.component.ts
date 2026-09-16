import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { StayCardComponent } from '../../shared/components/stay-card/stay-card.component';
import { StaysService } from '../../core/services/stays.service';
import { StaysStore } from '../../core/store/stays.store';

@Component({
  selector: 'app-stays-list',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    StayCardComponent,
  ],
  templateUrl: './stays-list.component.html',
  styleUrl: './stays-list.component.css',
})
export class StaysListComponent {
  readonly store = inject(StaysStore);

  private readonly staysService = inject(StaysService);

  isFavorite(stayId: number): boolean {
    return this.staysService.isFavorite(stayId);
  }

  toggleFavorite(stayId: number): void {
    this.staysService.toggleFavorite(stayId);
  }
}
