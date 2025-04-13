import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { map, take, tap } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  return authService.isLoggedIn().pipe(
    take(1),
    tap((isLoggedIn) => {
      if (isLoggedIn) {
        router.navigate(['/home']);
      }
    }),
    map((isLoggedIn) => !isLoggedIn)
  );
};
