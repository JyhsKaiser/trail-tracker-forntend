import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Run } from '../models/run.model';
import { Subject, switchMap, startWith, catchError, of, combineLatest } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class RunService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/runs';
  private userService = inject(UserService); // Inyectamos el servicio de usuario

  // Este "gatillo" nos servirá para refrescar la lista
  private refresh$ = new Subject<void>();
  private refreshTrigger = signal(0); // Un simple contador
  // La señal 'runs' se actualizará solita cada vez que refresh$ emita un valor
  runs = toSignal(
    combineLatest([
      toObservable(this.userService.currentUser),
      toObservable(this.refreshTrigger)
    ]).pipe(
      switchMap(([user, _]) => {
        // Si no hay usuario, devolvemos lista vacía inmediatamente (Logout)
        if (!user) return of([] as Run[]);

        // Si hay usuario, pedimos sus carreras
        return this.http.get<Run[]>(this.apiUrl, { withCredentials: true }).pipe(
          catchError(() => of([] as Run[]))
        );
      }),
      startWith([] as Run[])
    ),
    { initialValue: [] as Run[] }
  );

  saveRun(run: Run) {
    return this.http.post<Run>(this.apiUrl, run, { withCredentials: true })
      .subscribe(() => {
        // 🚀 ¡Simplemente incrementamos el trigger y todo el flujo se reinicia!
        this.refreshTrigger.update(v => v + 1);
      });
  }

  deleteRun(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true }).subscribe({
      next: () => {
        this.refreshTrigger.update(v => v + 1);
      }
    });
  }

}
