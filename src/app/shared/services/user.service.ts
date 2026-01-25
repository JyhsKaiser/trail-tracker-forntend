import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {

  // Signal para guardar el usuario actual de forma reactiva
  currentUser = signal<User | null>(null);
  authStatusFinished = signal(false);
  router = inject(Router);
  // runService = inject(RunService); // Inyectamos el servicio de carreras
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/users';

  // Verificar si hay una sesión activa al cargar la app
  checkSession(): Observable<User | null> {
    return this.http.get<User>(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
      tap(user => {
        this.currentUser.set(user);
        this.authStatusFinished.set(true);
      }),
      catchError(() => {
        this.currentUser.set(null);
        this.authStatusFinished.set(true);
        return of(null);
      })
    );
  }

  // Método de Logout (el servidor debe borrar la cookie)
  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .subscribe({
        next: () => {
          // Limpiamos el estado local
          this.currentUser.set(null);
          // Redirigimos al Login
          this.router.navigate(['/auth/login']);
        },
        error: (err) => console.error('Error al cerrar sesión', err)
      });
  }



  register(user: User) {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  login(username: string, password: string) {
    return this.http.post<User>(
      `${this.apiUrl}/login`,
      { username, password },
      { withCredentials: true }
    ).pipe(
      // 2. Cuando el login es exitoso, actualizamos la Signal automáticamente
      tap((user: User) => {
        this.currentUser.set(user);
        this.router.navigate(['/dashboard']);
        // Opcional: localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

}
