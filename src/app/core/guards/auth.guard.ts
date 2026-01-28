import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';


import { AuthService } from '../services/auth.service';

// 🛡️ Guard para rutas protegidas (Dashboard, Perfil...)
export const isAuthenticatedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUser()) return true;

  router.navigate(['/login']);
  return false;
};

// 🚫 Guard para rutas públicas (Login, Register)
export const isPublicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si ya tiene sesión, mándalo al dashboard
  if (authService.currentUser()) {
    router.navigate(['/dashboard']); // O tu ruta principal
    return false;
  }

  return true;
};
