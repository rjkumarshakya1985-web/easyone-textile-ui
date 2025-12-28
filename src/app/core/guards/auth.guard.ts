import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';

export const authGuard = () => {
  const storage = inject(LocalStorageService);
  const router = inject(Router);

  const token = storage.getToken();

  if (!token) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
