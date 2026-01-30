import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  let isRefreshing = false;

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      // 1. Errores de CSRF o Auth en endpoints de Auth
      if (req.url.includes('/api/auth/')) {
        if (error.status === 403) {
          console.error("❌ Error de CSRF o Permisos en Auth. Revisa headers y cookies.");
        }
        return throwError(() => error);
      }

      switch (error.status) {
        case 401: // Token expirado - Intentar Refresh
          if (!isRefreshing) {
            isRefreshing = true;
            return authService.refreshToken().pipe(
              switchMap(() => {
                isRefreshing = false;
                return next(req); // Reintento exitoso
              }),
              catchError((refreshErr) => {
                isRefreshing = false;
                authService.logout(); // Refresh falló, al login
                return throwError(() => refreshErr);
              })
            );
          }
          break;

        case 400:
          console.warn('Datos inválidos:', error.error?.message);
          break;

        case 500:
          console.error('🔥 Error en servidor Java (Azure)');
          break;
      }

      return throwError(() => error);
    })
  );
};
