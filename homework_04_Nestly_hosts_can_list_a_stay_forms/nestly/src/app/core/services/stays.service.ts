import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Stay } from '../models/stay.model';
import { NewStay } from '../models/new-stay.model';

@Injectable({
  providedIn: 'root',
})
export class StaysService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/stays';

  // Favorites are still client-side only.
  private readonly favoriteIds = signal<number[]>([]);

  getStays(params?: { superhost?: boolean; search?: string }): Observable<Stay[]> {
    let httpParams = new HttpParams();

    if (params?.superhost !== undefined) {
      httpParams = httpParams.set('superhost', params.superhost);
    }

    if (params?.search) {
      httpParams = httpParams.set('search', params.search);
    }

    return this.http.get<Stay[]>(this.baseUrl, {
      params: httpParams,
    });
  }

  getStayById(id: number): Observable<Stay> {
    return this.http.get<Stay>(`${this.baseUrl}/${id}`);
  }

  createStay(stay: NewStay): Observable<Stay> {
    const requestBody = {
      title: stay.title,
      location: stay.location,
      pricePerNight: stay.pricePerNight,
      description: stay.description,
      superhost: stay.superhost,

      // The backend expects "image", not "photos".
      // We use the first photo as the main image.
      image: stay.photos[0],
    };

    return this.http.post<Stay>(this.baseUrl, requestBody);
  }

  isFavorite(id: number): boolean {
    return this.favoriteIds().includes(id);
  }

  toggleFavorite(id: number): void {
    this.favoriteIds.update((ids) => {
      if (ids.includes(id)) {
        return ids.filter((favoriteId) => favoriteId !== id);
      }

      return [...ids, id];
    });
  }
}
