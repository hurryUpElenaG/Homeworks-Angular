import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { StaysService } from '../../core/services/stays.service';

@Component({
  selector: 'app-stay-detail',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './stay-detail.component.html',
  styleUrl: './stay-detail.component.css',
})
export class StayDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly staysService = inject(StaysService);

  readonly stayId = Number(this.route.snapshot.paramMap.get('id'));

  readonly stay = this.staysService.getStayById(this.stayId);

  isFavorite(): boolean {
    return this.staysService.isFavorite(this.stayId);
  }

  toggleFavorite(): void {
    this.staysService.toggleFavorite(this.stayId);
  }
}