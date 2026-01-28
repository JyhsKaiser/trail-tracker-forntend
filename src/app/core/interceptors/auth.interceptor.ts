import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      // 1. 🛡️ FILTRO TEMPRANO: Si el error viene de CUALQUIER endpoint de Auth,
      // dejamos que el servicio correspondiente lo maneje. No intentamos refrescar.
      if (req.url.includes('/api/auth/')) {
        return throwError(() => error);
      }

      // 2. DETECCIÓN DE TOKEN EXPIRADO
      if (error.status === 401 || error.status === 403) {

        return authService.refreshToken().pipe(
          switchMap(() => {
            // Si el refresh sale bien, reintentamos la petición original
            return next(req);
          }),
          catchError((refreshError) => {
            // 3. RESTRICCIÓN DE DAÑOS: Si el refresh falla, limpiamos el estado local.
            // No llamamos a logout() aquí para evitar peticiones HTTP circulares.
            authService.currentUser.set(null);

            // Redirigimos solo si es estrictamente necesario
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login';
            }

            return throwError(() => refreshError);
          })
        );
      }

      // 4. Otros errores (500, 404, etc.) pasan de largo al ErrorInterceptor global
      return throwError(() => error);
    })
  );

};
