import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';

import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, throwError } from 'rxjs';

import {
  catchError,
  finalize,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { AuthStore } from '../store/auth.store';

import { LoginResponse } from '../models/auth.model';

let refreshInFlight$: Observable<LoginResponse> | null = null;

export const authInterceptor: HttpInterceptorFn = (
  request,
  next,
) => {
  const store = inject(AuthStore);
  const authService = inject(AuthService);
  const router = inject(Router);

  const url = request.url;

  // Do not add the access token or refresh these requests.
  const isAuthRequest =
    url.includes('/auth/login') ||
    url.includes('/auth/register') ||
    url.includes('/auth/refresh');

  if (isAuthRequest) {
    return next(request);
  }

  const accessToken = store.accessToken();

  let authRequest = request;

  if (accessToken) {
    authRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return next(authRequest).pipe(

    catchError((error: HttpErrorResponse) => {

      // Only handle 401.
      if (error.status !== 401) {
        return throwError(() => error);
      }

      const refreshToken = store.refreshToken();

      // No refresh token means we cannot refresh.
      if (!refreshToken) {
        store.clearAuth();
        router.navigate(['/login']);

        return throwError(() => error);
      }

      //If another request is already refreshing, use that same refresh request.
      if (!refreshInFlight$) {
        refreshInFlight$ = authService
          .refresh(refreshToken)
          .pipe(

            tap((response) => {
              store.setTokens(response);
            }),

            catchError((refreshError) => {
              store.clearAuth();
              router.navigate(['/login']);

              return throwError(() => refreshError);
            }),

            finalize(() => {
              refreshInFlight$ = null;
            }),

            shareReplay({
              bufferSize: 1,
              refCount: false,
            }),
          );
      }

      // Wait for the existing/new refresh request. All requests reaching this point share it.
      return refreshInFlight$.pipe(

        switchMap((response) => {
          const retryRequest = request.clone({
            setHeaders: {
              Authorization:
                `Bearer ${response.accessToken}`,
            },
          });

          return next(retryRequest);
        }),

        catchError((refreshError) => {
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};