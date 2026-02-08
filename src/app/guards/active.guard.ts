import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';

export const activeGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const msgService = inject(MessageService);
  const router = inject(Router);
  
  if (authService.getUserStatus() === 'active') {
    return true;
  } else {
    msgService.add({
      severity: 'warn',
      summary: 'Анхааруулга',
      detail: 'Таны бүртгэл одоогоор идэвхгүй байна. Төлбөрөө төлж бүртгэлээ идэвхжүүлнэ үү.',
    });
    router.navigate(['/login']);
    return false;
  }
};
