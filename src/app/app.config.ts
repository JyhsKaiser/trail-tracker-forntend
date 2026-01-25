import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { routes } from './app.routes';
import { UserService } from './shared/services/user.service';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { xsrfInterceptor } from './core/interceptors/xsrf.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [

    // provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        errorInterceptor,
        xsrfInterceptor // 🛡️ Agregamos nuestro nuevo interceptor manual
      ])
      // // 🛡️ Configuración automática de CSRF
      // withXsrfConfiguration({
      //   cookieName: 'XSRF-TOKEN',
      //   headerName: 'X-XSRF-TOKEN',
      // })
    ),
    provideAppInitializer(() => {
      const userService = inject(UserService);
      return userService.checkSession();
    }),
  ]

};
