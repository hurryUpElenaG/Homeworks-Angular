import { Component, computed, inject, signal, type OnDestroy, type OnInit, } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Stay } from '../../core/models/stay.model';
import { StayCardComponent } from '../../shared/components/stay-card/stay-card.component';
import { StaysService } from '../../core/services/stays.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stays-list',
  standalone: true,
  imports: [
    StayCardComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './stays-list.component.html',
  styleUrls: ['./stays-list.component.css'],
})
export class StaysListComponent {
  private readonly staysService = inject(StaysService);

  readonly showSuperhostsOnly = signal(false);

  stays: Stay[] = [];

  subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.subscription = this.staysService.getStays().subscribe((stays) => {
      this.stays = stays;
    });
  }

  readonly filteredStays = computed(() => {
    if (this.showSuperhostsOnly()) {
      return this.stays.filter((stay) => stay.superhost);
    }

    return this.stays;
  });

  toggleSuperhosts(): void {
    this.showSuperhostsOnly.update((value) => !value);
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