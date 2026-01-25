import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  // Si ya terminamos de verificar la sesión previamente
  if (userService.authStatusFinished()) {
    return userService.currentUser() ? true : router.createUrlTree(['/auth/login']);
  }

  // Si es la primera vez (F5), esperamos a que el servicio responda
  return userService.checkSession().pipe(
    map(user => {
      if (user) return true;
      return router.createUrlTree(['/auth/login']);
    })
  );
};
