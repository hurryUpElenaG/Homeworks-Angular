import { computed } from '@angular/core';

import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';


type StaySearchState = {
  search: string;
  superhostOnly: boolean;
};


export function withStaySearch() {

  return signalStoreFeature(

    withState<StaySearchState>({
      search: '',
      superhostOnly: false,
    }),

    withComputed((state) => ({

      query: computed(() => ({
        search: state.search(),
        superhostOnly: state.superhostOnly(),
      })),
    })),

    withMethods((store) => ({

      setSearch(search: string): void {

        patchState(store, {
          search,
        });
      },

      toggleSuperhostOnly(): void {

        patchState(store, {
          superhostOnly: !store.superhostOnly(),
        });
      },
    })),

  );

}

