import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/stays-list/stays-list.component').then((m) => m.StaysListComponent),
  },

  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then((m) => m.RegisterComponent),
  },

  {
    path: 'host/new',
    canActivate: [authGuard],   //user needs to be logged in to create a new stay
    loadComponent: () =>
      import('./pages/host-new/host-new.component').then((m) => m.HostNewComponent),
  },

  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],   //user needs to be logged in, and user needs to be admin to to create a new stay
    loadComponent: () => import('./pages/admin/admin.component').then((m) => m.AdminComponent),
  },

  {
    path: 'not-allowed',

    loadComponent: () =>
      import('./pages/not-allowed/not-allowed.component').then((m) => m.NotAllowedComponent),
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
