import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingService } from '../../services/training.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // 👈 Importante
import { Run } from '../../models/run.model';
import { ActivatedRoute } from '@angular/router';
import { FooterComponent } from "../../../../shared/components/footter/footer.component";

@Component({
  selector: 'app-logbook',
  imports: [CommonModule, ReactiveFormsModule, FooterComponent],
  templateUrl: './logbook.component.html',
  styleUrl: './logbook.css',
})
export class LogbookComponent {
  private fb = inject(FormBuilder);
  private trainingService = inject(TrainingService);
  private route = inject(ActivatedRoute);

  // Obtenemos la señal del servicio (es de solo lectura)
  public runs = this.trainingService.runs;

  // Control del Modal
  public isModalOpen = signal(false);
  public selectedRunId = signal<number | null>(null); // 👈 ID para edición

  // Formulario Reactivo
  public runForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
    distanceKm: [null, [Validators.required, Validators.min(0.1)]],
    elevationGain: [null, [Validators.required, Validators.min(0)]],
    date: [new Date().toISOString().split('T')[0], [Validators.required]] // Fecha hoy por defecto
  });

  openAddModal() {
    this.runForm.reset({
      date: new Date().toISOString().split('T')[0]
    });
    this.isModalOpen.set(true);
  }

  openEditModal(run: Run) {
    this.selectedRunId.set(run.id!); // Guardamos el ID del Record para el envío

    // Cargamos los valores actuales en el formulario reactivo
    this.runForm.patchValue({
      name: run.name,
      distanceKm: run.distanceKm,
      elevationGain: run.elevationGain,
      date: run.date
    });

    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  onSubmit() {
    if (this.runForm.invalid) return;

    const runData = this.runForm.value;
    const id = this.selectedRunId();
    console.log('Enviando datos:', { id, runData }); // 👈 DEBUG
    const request = id
      ? this.trainingService.updateRun(id, runData)
      : this.trainingService.saveRun(runData);

    request.subscribe({
      next: () => this.closeModal(),
      error: (err) => console.error('Error en la operación:', err)
    });
  }

  onDelete(id: number | undefined) {
    if (!id) return;

    if (confirm('¿Estás seguro de que quieres eliminar esta ruta de tu bitácora?')) {
      this.trainingService.deleteRun(id);
    }
  }
  ngOnInit() {
    // Escuchamos el fragmento de la URL
    this.route.fragment.subscribe(shadowId => {
      if (shadowId) {
        setTimeout(() => {
          const element = document.getElementById(shadowId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('bg-emerald-500/20'); // Resaltado temporal
            setTimeout(() => element.classList.remove('bg-emerald-500/20'), 2000);
          }
        }, 300); // Pequeño delay para asegurar que los datos cargaron
      }
    });
  }

}
