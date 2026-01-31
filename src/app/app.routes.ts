import { Routes } from '@angular/router';
// import { authGuard } from './core/guards/auth.guard';
import { isAuthenticatedGuard, isPublicGuard } from './core/guards/auth.guard';
// export const routes: Routes = [
//   // Rutas de Autenticación (Públicas)
//   {
//     path: 'auth',
//     loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
//   },

//   // Rutas de la Aplicación (Privadas - Aquí irá el Guard después)
//   {
//     path: 'dashboard',
//     canActivate: [authGuard], // 🛡️ Aplicamos el guardia aquí
//     loadComponent: () => import('./features/runs/pages/dashboard/run-dashboard.component')
//       .then(m => m.RunDashboardComponent)
//   },

//   // Redirecciones globales
//   { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
//   { path: '**', redirectTo: 'auth/login' }
// ];
export const routes: Routes = [
  // ==========================================
  // 🔓 RUTAS PÚBLICAS (Grupo Auth)
  // ==========================================
  {
    path: 'auth',
    canActivate: [isPublicGuard], // No entras si ya estás logueado
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/pages/register/register.component').then(m => m.RegisterComponent)
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  // ==========================================
  // 🔐 RUTAS PRIVADAS (Grupo Sistema)
  // ==========================================
  {
    path: 'dashboard',
    canActivate: [isAuthenticatedGuard],
    loadComponent: () => import('./features/dashboard/layout/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayout),
    children: [
      {
        path: 'analytics',
        loadComponent: () => import('./features/training/pages/analytics/analytics.component').then(m => m.AnalyticsComponent)
      },
      {
        path: 'logbook',
        loadComponent: () => import('./features/training/pages/logbook/logbook.component').then(m => m.LogbookComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/user/pages/profile/profile.component').then(m => m.ProfileComponent)
      },
      { path: '', redirectTo: 'analytics', pathMatch: 'full' }
    ]
  },

  // ==========================================
  // 🚩 COMODINES Y REDIRECCIONES GLOBALES
  // ==========================================
  {
    path: 'forbidden',
    loadComponent: () => import('./core/components/errors/error-403/error-403.component')
      .then(m => m.Error403Component)
  },
  // Captura cualquier ruta no permitida por los Guards de seguridad
  { path: '403', redirectTo: '/forbidden' },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' }
];
