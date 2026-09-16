import { computed, inject } from '@angular/core';

import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { withDevtools } from '@angular-architects/ngrx-toolkit';

import { of, pipe } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { Stay } from '../models/stay.model';
import { StaysService } from '../services/stays.service';

import { withStaySearch } from './stay-search.feature';

type StaysState = {
  stays: Stay[];
  isLoading: boolean;
  error: string | null;
};

export const StaysStore = signalStore(
  { providedIn: 'root' },

  withState<StaysState>({
    stays: [],
    isLoading: false,
    error: null,
  }),

  withStaySearch(),

  withComputed((state) => ({
    count: computed(() => state.stays().length),
    hasResults: computed(() => state.stays().length > 0),
  })),

  withMethods((store, staysService = inject(StaysService)) => ({
    loadStays: rxMethod<{
      search: string;
      superhostOnly: boolean;
    }>(
      pipe(
        tap(() => {
          patchState(store, {
            isLoading: true,
            error: null,
          });
        }),

        switchMap(({ search, superhostOnly }) =>
          staysService
            .getStays({
              search,
              superhost: superhostOnly || undefined,
            })
            .pipe(
              tap((stays) => {
                patchState(store, {
                  stays,
                  isLoading: false,
                  error: null,
                });
              }),

              catchError(() => {
                patchState(store, {
                  stays: [],
                  isLoading: false,
                  error: 'Could not load stays',
                });

                return of([]);
              }),
            ),
        ),
      ),
    ),
  })),

  // Keep DevTools
  withDevtools('Nestly Stays Store'),

  withHooks({
    onInit(store) {
      store.loadStays(store.query);
    },
  }),
);