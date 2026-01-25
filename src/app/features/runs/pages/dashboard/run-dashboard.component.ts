
import { Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RunService } from '../../../../shared/services/run.service';
import { Run } from '../../../../shared/models/run.model';
import { UserService } from '../../../../shared/services/user.service';


@Component({
  selector: 'app-run-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule], // Cambiamos FormsModule por ReactiveFormsModule
  templateUrl: './run-dashboard.component.html'
})
export class RunDashboardComponent {

  runService = inject(RunService);
  userService = inject(UserService);



  // Señales Computadas para el Dashboard
  totalDistance = computed(() =>
    this.runService.runs().reduce((acc, run) => acc + run.distanceKm, 0).toFixed(1)
  );

  totalElevation = computed(() =>
    this.runService.runs().reduce((acc, run) => acc + run.elevationGain, 0)
  );

  runForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    distanceKm: new FormControl(0, { nonNullable: true, validators: [Validators.min(0.1)] }),
    elevationGain: new FormControl(0, { nonNullable: true, validators: [Validators.min(0)] }),
    date: new FormControl(new Date().toISOString().split('T')[0], { nonNullable: true })
  });

  onSubmit() {
    if (this.runForm.valid) {
      this.runService.saveRun(this.runForm.getRawValue() as Run);
      this.runForm.reset({
        date: new Date().toISOString().split('T')[0],
        distanceKm: 0,
        elevationGain: 0
      });
    }
  }

  onDelete(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta ruta?')) {
      this.runService.deleteRun(id);
    }
  }


  constructor() {
    this.userService.checkSession();
  }
}
