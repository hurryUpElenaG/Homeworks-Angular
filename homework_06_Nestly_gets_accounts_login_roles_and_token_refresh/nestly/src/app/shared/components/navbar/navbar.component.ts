import { Component, inject } from '@angular/core';

import {
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AuthStore } from '../../../core/store/auth.store';

@Component({
  selector: 'app-navbar',
  standalone: true,

  imports: [
    RouterLink,
    RouterLinkActive,

    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
  ],

  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  readonly store = inject(AuthStore);
}