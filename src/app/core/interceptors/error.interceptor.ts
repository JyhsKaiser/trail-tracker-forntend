import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { UserService } from '../../shared/services/user.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const userService = inject(UserService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el servidor nos dice que no estamos autorizados (Cookie inválida/expirada)
      if (error.status === 401) {
        userService.currentUser.set(null); // Limpiamos la Signal
        router.navigate(['/auth/login']);
      }

      // Podrías manejar errores 500 o 403 aquí también
      const errorMessage = error.error?.message || 'Ocurrió un error inesperado';
      console.error('🔴 Error Global:', errorMessage);

      return throwError(() => error);
    })
  );
};
