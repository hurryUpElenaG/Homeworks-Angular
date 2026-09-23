import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { rxMethod } from '@ngrx/signals/rxjs-interop';

import { of, pipe } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

import { Login, Register, User } from '../models/auth.model';

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
};

type LoginRequest = {
  credentials: Login;
  returnUrl?: string;
};

const getInitialState = (): AuthState => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const userJson = localStorage.getItem('user');

  let user: User | null = null;

  if (userJson) {
    try {
      user = JSON.parse(userJson) as User;
    } catch {
      user = null;
    }
  }

  return {
    user,
    accessToken,
    refreshToken,
    isLoading: false,
    error: null,
  };
};

export const AuthStore = signalStore(
  { providedIn: 'root' },

  withState(getInitialState()),

  withComputed((store) => ({
    isLoggedIn: computed(() => !!store.user()),

    isAdmin: computed(() => store.user()?.role === 'ADMIN'),
  })),

  withMethods((store) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const saveAuthData = (response: { accessToken: string; refreshToken: string; user: User }) => {
      patchState(store, {
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });

      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
    };

    const clearAuthData = () => {
      patchState(store, {
        user: null,
        accessToken: null,
        refreshToken: null,
        error: null,
      });

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    };

    return {
      login: rxMethod<LoginRequest>(
        pipe(
          tap(() => {
            patchState(store, {
              isLoading: true,
              error: null,
            });
          }),

          switchMap(({ credentials, returnUrl }) =>
            authService.login(credentials).pipe(
              tap((response) => {
                saveAuthData(response);

                patchState(store, {
                  isLoading: false,
                  error: null,
                });

                const destination = returnUrl && returnUrl.startsWith('/') ? returnUrl : '/';

                router.navigateByUrl(destination);
              }),

              catchError((error) => {
                patchState(store, {
                  isLoading: false,
                  error: error.error?.message ?? 'Invalid email or password',
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

                patchState(store, {
                  isLoading: false,
                  error: null,
                });

                router.navigate(['/']);
              }),

              catchError((error) => {
                patchState(store, {
                  isLoading: false,
                  error: error.error?.message ?? 'Registration failed',
                });

                return of(null);
              }),
            ),
          ),
        ),
      ),

      setTokens: (response: { accessToken: string; refreshToken: string; user: User }) => {
        saveAuthData(response);
      },

      clearAuth: () => {
        clearAuthData();
      },

      logout: () => {
        authService.logout().subscribe({
          next: () => {
            clearAuthData();
            router.navigate(['/login']);
          },

          error: () => {
            clearAuthData();
            router.navigate(['/login']);
          },
        });
      },
    };
  }),
);
