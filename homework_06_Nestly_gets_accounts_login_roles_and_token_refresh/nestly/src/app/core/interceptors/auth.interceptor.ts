import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';

import { Router } from '@angular/router';

import { catchError, switchMap, throwError } from 'rxjs';

import { AuthStore } from '../store/auth.store';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(AuthStore);
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthRequest =
    req.url.endsWith('/auth/login') ||
    req.url.endsWith('/auth/register') ||
    req.url.endsWith('/auth/refresh');

  // Login, register and refresh must not receive the normal Authorization header.
  if (isAuthRequest) {
    return next(req);
  }

  const accessToken = store.accessToken();

  let request = req;

  //Attach the access token when one exists.
  if (accessToken) {
    request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      
      // Only try refresh for 401.
      if (error.status !== 401) {
        return throwError(() => error);
      }

      // There is no refresh token. The user has to log in again.
      const refreshToken = store.refreshToken();

      if (!refreshToken) {
        store.clearAuth();
        router.navigate(['/login']);

        return throwError(() => error);
      }

      // Ask the backend for a new access token and a new refresh token.
      return authService.refresh(refreshToken).pipe(
        switchMap((response) => {
        
          // Save BOTH new tokens because the backend rotates the refresh token.
          store.setTokens(response);

          // Retry the original request with the NEW access token.
          const retryRequest = req.clone({
            setHeaders: {
              Authorization: `Bearer ${response.accessToken}`,
            },
          });

          return next(retryRequest);
        }),

        catchError((refreshError) => {
          
          // Refresh failed. Clear authentication and send the user  to login.
          store.clearAuth();

          router.navigate(['/login']);

          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
