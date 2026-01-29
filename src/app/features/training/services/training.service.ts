import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Run } from '../models/run.model';
import { Subject, switchMap, startWith, catchError, of, combineLatest, tap, Observable } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TrainingService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/runs`;

  // private userService = inject(UserService); // Inyectamos el servicio de usuario
  private authService = inject(AuthService)
  // Este "gatillo" nos servirá para refrescar la lista
  private refresh$ = new Subject<void>();
  private refreshTrigger = signal(0); // Un simple contador
  // La señal 'runs' se actualizará solita cada vez que refresh$ emita un valor
  runs = toSignal(
    combineLatest([
      toObservable(this.authService.currentUser),
      toObservable(this.refreshTrigger)
    ]).pipe(
      switchMap(([user, _]) => {
        // Si no hay usuario, devolvemos lista vacía inmediatamente (Logout)
        if (!user) return of([] as Run[]);

        // Si hay usuario, pedimos sus carreras
        return this.http.get<Run[]>(this.API_URL, { withCredentials: true }).pipe(
          catchError(() => of([] as Run[]))
        );
      }),
      startWith([] as Run[])
    ),
    { initialValue: [] as Run[] }
  );

  saveRun(run: Run): Observable<Run> {
    return this.http.post<Run>(this.API_URL, run, { withCredentials: true }).pipe(
      tap(() => this.refreshTrigger.update(v => v + 1))
    );
  }

  updateRun(id: number, run: Run): Observable<Run> {
    return this.http.patch<Run>(`${this.API_URL}/${id}`, run, { withCredentials: true }).pipe(
      tap(() => this.refreshTrigger.update(v => v + 1))
    );
  }

  deleteRun(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`, { withCredentials: true }).subscribe({
      next: () => {
        this.refreshTrigger.update(v => v + 1);
      }
    });
  }

}
