import { Component, computed, inject, signal, OnDestroy, OnInit } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Stay } from '../../core/models/stay.model';
import { StayCardComponent } from '../../shared/components/stay-card/stay-card.component';
import { StaysService } from '../../core/services/stays.service';

@Component({
  selector: 'app-stays-list',
  standalone: true,
  imports: [StayCardComponent, MatButtonModule, MatIconModule],
  templateUrl: './stays-list.component.html',
  styleUrl: './stays-list.component.css',
})
export class StaysListComponent implements OnInit, OnDestroy {
  private readonly staysService = inject(StaysService);
  readonly showSuperhostsOnly = signal(false);
  readonly stays = signal<Stay[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  private subscription = new Subscription();
  readonly filteredStays = computed(() => this.stays());

  /*readonly filteredStays = computed(() => {
    if (this.showSuperhostsOnly()) {
      return this.stays.filter((stay) => stay.superhost);
    }

    return this.stays;
  });*/

  ngOnInit(): void {
    this.loadStays();
  }

  loadStays(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const superhost = this.showSuperhostsOnly() ? true : undefined;

    this.subscription.add(
      this.staysService.getStays({ superhost }).subscribe({
        next: (stays) => {
          this.stays.set(stays);
          this.isLoading.set(false);
        },

        error: (error: HttpErrorResponse) => {
          console.error('Failed to load stays:', error);

          this.stays.set([]);
          this.isLoading.set(false);

          this.errorMessage.set(
            'Sorry, we could not load the stays. Please make sure the Nestly server is running.',
          );
        },
      }),
    );
  }

  toggleSuperhosts(): void {
    this.showSuperhostsOnly.update((value) => !value);

    this.loadStays();
  }

  isFavorite(stayId: number): boolean {
    return this.staysService.isFavorite(stayId);
  }

  toggleFavorite(stayId: number): void {
    this.staysService.toggleFavorite(stayId);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
