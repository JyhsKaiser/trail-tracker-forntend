import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { routes } from './app.routes';

import { errorInterceptor } from './core/interceptors/error.interceptor';
// import { xsrfInterceptor } from './core/interceptors/xsrf.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AuthService } from './core/services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [

    // provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        errorInterceptor,
        // xsrfInterceptor, // 🛡️ Agregamos nuestro nuevo interceptor manual
        authInterceptor  // Tu nuevo gestor de tokens
      ])
    ),
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.checkSession();
    }),
  ]

};
