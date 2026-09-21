import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

import { StaysService } from '../../core/services/stays.service';
import { Stay } from '../../core/models/stay.model';

@Component({
  selector: 'app-admin',
  standalone: true,

  imports: [MatButtonModule, MatTableModule],

  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  private readonly staysService = inject(StaysService);

  readonly stays = signal<Stay[]>([]);
  readonly error = signal<string | null>(null);

  readonly displayedColumns = ['id', 'title', 'location', 'price', 'actions'];

  constructor() {
    this.loadStays();
  }

  private loadStays(): void {
    this.staysService.getStays().subscribe({
      next: (stays) => {
        this.stays.set(stays);
      },

      error: () => {
        this.error.set('Could not load stays.');
      },
    });
  }

  deleteStay(id: number): void {
    this.error.set(null);

    this.staysService.deleteStay(id).subscribe({
      next: () => {
        this.stays.update((stays) => stays.filter((stay) => stay.id !== id));
      },

      error: (error: HttpErrorResponse) => {
        if (error.status === 403) {
          this.error.set("You don't have permission to delete this stay.");
        } else {
          this.error.set('Could not delete the stay.');
        }
      },
    });
  }
}
