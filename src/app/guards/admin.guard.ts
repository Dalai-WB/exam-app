import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserStateService } from '../services/user-state.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const userState = inject(UserStateService);
  const router = inject(Router);

  if (userState.snapshot?.role === 'admin') {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
