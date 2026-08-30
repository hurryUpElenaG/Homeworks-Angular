import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/stays-list/stays-list.component').then((m) => m.StaysListComponent),
  },

  {
    path: 'stays/:id',
    loadComponent: () =>
      import('./pages/stay-detail/stay-detail.component').then((m) => m.StayDetailComponent),
  },

  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
