import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { LoaderService } from '../services/loader.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const loader = inject(LoaderService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      loader.hide();

      let msg = 'Unexpected error occurred';

      // Read structured .NET API error
      if (error.error?.Message) {
        msg = error.error.Message;
        if (error.error?.Details) {
          msg += ` | ${error.error.Details}`;
        }
      } else if (error.status) {
        msg = `Error ${error.status}: ${error.statusText}`;
      }

      messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: msg,
        life: 4000
      });

      return throwError(() => error);
    })
  );
};
