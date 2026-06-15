import { HttpInterceptorFn, HttpErrorResponse, HttpContextToken } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { AuthService } from '../services/auth-service';
import { catchError, of, switchMap, throwError } from 'rxjs';

export const SKIP_INTERCEPTOR = new HttpContextToken<boolean>(() => false);

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(LocalStorageService);
  const authService = inject(AuthService);

  // 🔒 Skip for refresh token API
  if (req.context.get(SKIP_INTERCEPTOR)) {
    return next(req);
  }

  let token = storage.getToken();

const userStatus = getClaim(token, 'user_status');

 if (userStatus?.toString().toLowerCase() === 'false') {
   storage.clearAll();
  window.location.href = '/login';
  return throwError(() => new Error('User is inactive'));
}

  function getTokenExpiry(token: string | null): number {
    if (!token) return 0;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000;
    } catch {
      return 0;
    }
  }

  function isTokenExpiringSoon(token: string | null, bufferSeconds = 60): boolean {
    if (!token) return false;
    return Date.now() + bufferSeconds * 1000 > getTokenExpiry(token);
  }

  function getClaim(token: string | null, claimName: string): any {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload[claimName];
  } catch {
    return null;
  }
}
  const refreshIfNeeded$ =
    token && isTokenExpiringSoon(token)
      ? authService.refreshToken().pipe(
          switchMap((res: any) => {
            storage.setTokens(res.token, res.refreshToken);
            token = res.token;
            return of(token);
          }),
          catchError(() => {
            storage.clearAll();
            window.location.href = '/login';
            return throwError(() => new Error('Refresh failed'));
          })
        )
      : of(token);

  return refreshIfNeeded$.pipe(
    switchMap((validToken) => {
      const authReq = validToken
        ? req.clone({ setHeaders: { Authorization: `Bearer ${validToken}` } })
        : req;

      return next(authReq);
    }),

    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        storage.clearAll();
        window.location.href = '/login';
      }
      return throwError(() => error);
    })
  );
};
