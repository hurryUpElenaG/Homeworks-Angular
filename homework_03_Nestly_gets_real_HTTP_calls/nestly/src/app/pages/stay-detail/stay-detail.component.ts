import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CurrencyPipe } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { Stay } from '../../core/models/stay.model';
import { StaysService } from '../../core/services/stays.service';

@Component({
  selector: 'app-stay-detail',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatDividerModule, CurrencyPipe],
  templateUrl: './stay-detail.component.html',
  styleUrl: './stay-detail.component.css',
})
export class StayDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly staysService = inject(StaysService);
  readonly stayId = Number(this.route.snapshot.paramMap.get('id'));
  readonly stay = signal<Stay | null>(null);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly notFound = signal(false);
  private subscription = new Subscription();

  ngOnInit(): void {
    this.loadStay();
  }

  loadStay(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.notFound.set(false);

    this.subscription.add(
      this.staysService.getStayById(this.stayId).subscribe({
        next: (stay) => {
          this.stay.set(stay);
          this.isLoading.set(false);
        },

        error: (error: HttpErrorResponse) => {
          console.error('Failed to load stay:', error);

          this.isLoading.set(false);

          if (error.status === 404) {
            this.stay.set(null);
            this.notFound.set(true);
            return;
          }

          this.errorMessage.set(
            'Sorry, we could not load this stay. Please make sure the Nestly server is running.',
          );
        },
      }),
    );
  }

  isFavorite(): boolean {
    return this.staysService.isFavorite(this.stayId);
  }

  toggleFavorite(): void {
    this.staysService.toggleFavorite(this.stayId);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
