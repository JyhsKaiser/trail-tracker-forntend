import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Rutas de Autenticación (Públicas)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  // Rutas de la Aplicación (Privadas - Aquí irá el Guard después)
  {
    path: 'dashboard',
    canActivate: [authGuard], // 🛡️ Aplicamos el guardia aquí
    loadComponent: () => import('./features/runs/pages/dashboard/run-dashboard.component')
      .then(m => m.RunDashboardComponent)
  },

  // Redirecciones globales
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' }
];
