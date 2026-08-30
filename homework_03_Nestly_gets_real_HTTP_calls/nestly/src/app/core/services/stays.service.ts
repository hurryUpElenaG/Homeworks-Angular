import { Injectable, signal } from '@angular/core';
import { Stay } from '../models/stay.model';
import { BehaviorSubject, type Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class StaysService {
  private _stays: BehaviorSubject<Stay[]> = new BehaviorSubject([
    {
      id: 1,
      title: 'Cozy Mountain Cabin',
      location: 'Mavrovo, North Macedonia',
      pricePerNight: 95,
      rating: 4.9,
      image: 'https://picsum.photos/800/500?random=1',
      superhost: true,
      description:
        'A cozy cabin surrounded by nature, perfect for a peaceful mountain weekend.',
    },
    {
      id: 2,
      title: 'Lake View Apartment',
      location: 'Ohrid, North Macedonia',
      pricePerNight: 120,
      rating: 4.8,
      image: 'https://picsum.photos/800/500?random=2',
      superhost: true,
      description:
        'A comfortable apartment with a beautiful view of Lake Ohrid and the old town.',
    },
    {
      id: 3,
      title: 'Modern City Apartment',
      location: 'Skopje, North Macedonia',
      pricePerNight: 75,
      rating: 4.6,
      image: 'https://picsum.photos/800/500?random=3',
      superhost: false,
      description:
        'A modern apartment close to restaurants, shops and the city center.',
    },
    {
      id: 4,
      title: 'Countryside House',
      location: 'Berovo, North Macedonia',
      pricePerNight: 90,
      rating: 4.7,
      image: 'https://picsum.photos/800/500?random=4',
      superhost: false,
      description:
        'A quiet countryside house with a garden and beautiful mountain views.',
    },
    {
      id: 5,
      title: 'Vineyard Villa',
      location: 'Tikvesh, North Macedonia',
      pricePerNight: 180,
      rating: 5,
      image: 'https://picsum.photos/800/500?random=5',
      superhost: true,
      description:
        'A spacious villa surrounded by vineyards, ideal for a relaxing getaway.',
    },
    {
      id: 6,
      title: 'Forest Retreat',
      location: 'Krushevo, North Macedonia',
      pricePerNight: 110,
      rating: 4.9,
      image: 'https://picsum.photos/800/500?random=6',
      superhost: true,
      description:
        'A peaceful forest retreat where you can enjoy fresh air and beautiful scenery.',
    },
  ]);

  private readonly favoriteIds = signal<number[]>([]);

  getStays(): Observable<Stay[]> {
    return this._stays.asObservable();
  }

  getStayById(id: number): Stay | undefined {
    return this._stays.getValue().find((stay) => stay.id === id);
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
