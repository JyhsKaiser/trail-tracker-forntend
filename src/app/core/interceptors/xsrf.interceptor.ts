
// import { HttpInterceptorFn } from '@angular/common/http';

// export const xsrfInterceptor: HttpInterceptorFn = (req, next) => {
//   // 1. Intentar leer la cookie XSRF-TOKEN del navegador
//   const cookies = document.cookie.split('; ');
//   const xsrfCookie = cookies.find(c => c.startsWith('XSRF-TOKEN='));
//   const token = xsrfCookie ? xsrfCookie.split('=')[1] : null;

//   // 2. Si existe el token y la petición es para nuestra API, lo inyectamos
//   if (token && (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE' || req.method === 'PATCH')) {
//     req = req.clone({
//       headers: req.headers.set('X-XSRF-TOKEN', token)
//     });
//   }

//   return next(req);
// };
