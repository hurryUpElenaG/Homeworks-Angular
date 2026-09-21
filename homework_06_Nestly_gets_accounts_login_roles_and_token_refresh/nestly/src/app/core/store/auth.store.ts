import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

import { rxMethod } from '@ngrx/signals/rxjs-interop';

import { of, pipe } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { Login, Register, LoginResponse, User } from '../models/auth.model';

import { AuthService } from '../services/auth.service';

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
};

function getStoredUser(): User | null {
  const value = localStorage.getItem('nestly_user');

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as User;
  } catch {
    return null;
  }
}

function getInitialState(): AuthState {
  return {
    user: getStoredUser(),
    accessToken: localStorage.getItem('nestly_access_token'),
    refreshToken: localStorage.getItem('nestly_refresh_token'),
    isLoading: false,
    error: null,
  };
}

export const AuthStore = signalStore(
  { providedIn: 'root' },

  withState<AuthState>(getInitialState()),

  withComputed((state) => ({
    isLoggedIn: computed(() => !!state.user()),

    isAdmin: computed(() => state.user()?.role === 'ADMIN'),
  })),

  withMethods((store, authService = inject(AuthService), router = inject(Router)) => {
    const saveAuthData = (response: LoginResponse): void => {
      patchState(store, {
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isLoading: false,
        error: null,
      });

      localStorage.setItem('nestly_access_token', response.accessToken);
      localStorage.setItem('nestly_refresh_token', response.refreshToken);
      localStorage.setItem('nestly_user', JSON.stringify(response.user));
    };

    const clearAuthData = (): void => {
      patchState(store, {
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
        error: null,
      });

      localStorage.removeItem('nestly_access_token');
      localStorage.removeItem('nestly_refresh_token');
      localStorage.removeItem('nestly_user');
    };

    return {
      login: rxMethod<Login>(
        pipe(
          tap(() => {
            patchState(store, {
              isLoading: true,
              error: null,
            });
          }),

          switchMap((credentials) =>
            authService.login(credentials).pipe(
              tap((response) => {
                saveAuthData(response);

                router.navigate(['/']);
              }),

              catchError((error) => {
                patchState(store, {
                  isLoading: false,
                  error: error?.error?.message ?? 'Invalid credentials',
                });

                return of(null);
              }),
            ),
          ),
        ),
      ),

      register: rxMethod<Register>(
        pipe(
          tap(() => {
            patchState(store, {
              isLoading: true,
              error: null,
            });
          }),

          switchMap((data) =>
            authService.register(data).pipe(
              tap((response) => {
                saveAuthData(response);

                router.navigate(['/']);
              }),

              catchError((error) => {
                patchState(store, {
                  isLoading: false,
                  error: error?.error?.message ?? 'Could not create your account',
                });

                return of(null);
              }),
            ),
          ),
        ),
      ),

      setTokens(response: LoginResponse): void {
        saveAuthData(response);
      },

      clearAuth(): void {
        clearAuthData();
      },

      logout(): void {
        authService.logout().subscribe({
          next: () => {
            clearAuthData();
            router.navigate(['/login']);
          },

          error: () => {
            // Even if the server logout fails,
            // clear the local authentication state.
            clearAuthData();
            router.navigate(['/login']);
          },
        });
      },
    };
  }),

  withHooks({
    onInit(store) {
      // Authentication data is already restored
      // from localStorage by getInitialState().
      //
      // Nothing else is necessary here.
      console.log('AuthStore initialized');
    },
  }),
);
