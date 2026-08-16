import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Stay } from './core/models/stay.model';
import { StayCardComponent } from './shared/components/stay-card/stay-card.component';
import { HighlightCardDirective } from './shared/directives/highlight-card.directive';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    NavbarComponent,
    FooterComponent,
    StayCardComponent,
    HighlightCardDirective,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {

  // Hardcoded stays
  stays: Stay[] = [

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

  ];

  // Controls whether we show only Superhosts
  showSuperhostsOnly = signal(false);

  // Creates the list that will be displayed
  filteredStays = computed(() => {

    if (this.showSuperhostsOnly()) {
      return this.stays.filter(stay => stay.superhost);
    }

    return this.stays;
  });

  // Toggle the Superhost filter
  toggleSuperhosts() {
    this.showSuperhostsOnly.update(value => !value);
  }

  // Receives the event from StayCard
  onFavorited(event: {
    id: number;
    favorited: boolean;
  }) {

    console.log('Favorite changed:', event);

  }
}