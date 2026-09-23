import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStore } from '../store/auth.store';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(AuthStore);
  const router = inject(Router);

  if (store.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: {             //For Bonus
      returnUrl: state.url,    //If the user tries /host/new Angular send them to /login?returnUrl=/host/new
    },
  });
};
