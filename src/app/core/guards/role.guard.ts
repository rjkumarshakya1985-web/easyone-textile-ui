import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
// core/guards/role.guard.ts
export const roleGuard = (role: string) => () => {
  const storage = inject(LocalStorageService);
  const router = inject(Router);

  const user = storage.getUser();
  const token = storage.getToken();

  if (!token || !user || user.roleName !== role) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
