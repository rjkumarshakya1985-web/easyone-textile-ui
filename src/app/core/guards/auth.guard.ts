import { inject } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';

export const authGuard = (_route?: unknown, state?: RouterStateSnapshot) => {
  const storage = inject(LocalStorageService);
  const router = inject(Router);

  const token = storage.getToken();
  const user = storage.getUser();

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  if (user?.roleName === 'Supplier' && user?.mustChangePassword && state?.url !== '/supplier/change-password') {
    router.navigate(['/supplier/change-password']);
    return false;
  }

  return true;
};
