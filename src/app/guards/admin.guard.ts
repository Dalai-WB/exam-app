import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  
  if (authService.getUserRole() === 'admin') {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
