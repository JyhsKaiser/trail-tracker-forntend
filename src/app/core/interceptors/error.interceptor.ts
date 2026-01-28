import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  // Imagina que tienes un servicio de notificaciones tipo Toast o Alert
  // const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      // 1. Ignorar Auth (Ya lo manejamos en el servicio)
      if (req.url.includes('/api/auth/')) {
        return throwError(() => error);
      }

      switch (error.status) {
        case 400:
          // Error de Negocio: El usuario hizo algo mal.
          console.warn('Petición incorrecta:', error.error?.message);
          // toast.show("Revisa los datos ingresados");
          break;

        case 401:
        case 403:
          // Sesión expirada
          authService.currentUser.set(null);
          router.navigate(['/auth/login']);
          break;

        case 404:
          // Recurso no encontrado
          console.error('No se encontró el recurso');
          break;

        case 500:
          // Error de Servidor: Algo explotó en Java.
          console.error('🔥 Error Crítico en Servidor:', error.error);
          // toast.show("Lo sentimos, hay problemas en el servidor");
          break;

        default:
          console.error('Error no controlado:', error.statusText);
      }

      return throwError(() => error);
    })
  );
};
