import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {

  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:8080/api/users';




  // register(user: User) {
  //   return this.http.post<User>(`${this.apiUrl}/register`, user, { withCredentials: true }).pipe(tap(() => { alert(user) }));
  // }
  register(user: User) {
    return this.http.post<User>(`${this.apiUrl}/register`, user, { withCredentials: true }).pipe(
      tap({
        next: (res) => alert(`Usuario ${res.username} registrado con éxito`),
        error: (err) => {
          console.error('Error en el registro:', err);
          alert('Fallo en el registro: ' + (err.error?.message || 'Error desconocido'));
        }
      })
    );
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/me`, userData, { withCredentials: true }).pipe(
      tap((updatedUser) => {
        // 🔄 Actualizamos la señal global del usuario para que toda la app sepa el nuevo nombre
        this.authService.currentUser.set(updatedUser);
      })
    );
  }

  changePassword(data: { oldPassword: string; newPassword: string }): Observable<void> {
    // 🔐 Enviamos el PATCH al sub-recurso de seguridad del usuario actual
    return this.http.patch<void>(`${this.apiUrl}/me/password`, data, { withCredentials: true }).pipe(
      tap(() => {
        console.log('✅ Credenciales actualizadas correctamente en el servidor');
      })
    );
  }

}
