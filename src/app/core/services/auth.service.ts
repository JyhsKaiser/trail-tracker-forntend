import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, finalize, Observable, of, switchMap, tap } from 'rxjs';
import { User } from '../../features/user/models/user.model';
import { Router } from '@angular/router';
import { Credenciales } from '../../features/auth/models/credenciales.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(null);
  authStatusFinished = signal(false);
  router = inject(Router);
  private http = inject(HttpClient);
  private readonly AUTH_URL = 'http://localhost:8080/api/auth';

  // ... otros métodos (login, logout)

  refreshToken() {
    // 🛡️ Llamamos al endpoint de refresh.
    // Al usar withCredentials: true, el navegador envía la cookie refreshToken automáticamente.
    return this.http.post<void>(`${this.AUTH_URL}/refresh`, {}, {
      withCredentials: true
    });
  }

  // login(username: string, password: string): Observable<User> {
  login(credenciales: Credenciales): Observable<User> {
    return this.http.post<User>(
      `${this.AUTH_URL}/login`,
      credenciales,
      { withCredentials: true }
    ).pipe(
      tap((user: User) => {
        // Seteamos el usuario directamente, ya lo tenemos del POST
        this.currentUser.set(user);
      }),
      finalize(() => this.authStatusFinished.set(true))
    );
  }

  checkSession(): Observable<User | null> {
    return this.http.get<User>(`${this.AUTH_URL}/me`, { withCredentials: true }).pipe(
      tap(user => { this.currentUser.set(user); }),
      catchError(() => {
        // Si falla, simplemente no hay usuario. No imprimimos error.
        this.currentUser.set(null);
        return of(null);
      }),
      finalize(() => this.authStatusFinished.set(true))


    );
  }

  // Método de Logout (el servidor debe borrar la cookie)
  logout() {
    return this.http.post(`${this.AUTH_URL}/logout`, {}, { withCredentials: true })
      .subscribe({
        next: () => {
          // Limpiamos el estado local
          this.currentUser.set(null);

          // Redirigimos al Login
          this.router.navigate(['/auth/login']);
          // localStorage.setItem('user', '');
        },
        error: (err) => console.error('Error al cerrar sesión', err)
      });
  }

}
