import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UserStateService } from '../services/user-state.service';

export const activeGuard: CanActivateFn = (route, state) => {
  const userState = inject(UserStateService);
  const msgService = inject(MessageService);
  const router = inject(Router);

  if (userState.snapshot?.status === 'active') {
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
