import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingService } from '../../services/training.service';
import { Router } from '@angular/router';
import { FooterComponent } from "../../../../shared/components/footter/footer.component"; // 👈 Importar Router
@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  templateUrl: './analytics.component.html'
})
export class AnalyticsComponent {
  private trainingService = inject(TrainingService);
  private router = inject(Router);
  // Referencia a la señal del servicio
  public runs = this.trainingService.runs;

  // 🏃 Distancia Total (Sumatoria de distanceKm)
  public totalKm = computed(() =>
    this.runs().reduce((acc, run) => acc + (run.distanceKm || 0), 0).toFixed(1)
  );

  // 🏔️ Desnivel Acumulado (Sumatoria de elevationGain)
  public totalElevation = computed(() =>
    this.runs().reduce((acc, run) => acc + (run.elevationGain || 0), 0)
  );

  // 🏁 Conteo de Actividades
  public totalRuns = computed(() => this.runs().length);

  // 🏆 Nivel del Corredor (Lógica de gamificación)
  public runnerLevel = computed(() => {
    const km = Number(this.totalKm());
    if (km > 100) return 'Skyrunner 🏔️';
    if (km > 50) return 'Trail Runner 🏃';
    return 'Entusiasta 🌱';
  });

  public lastRun = computed(() => {
    const currentRuns = this.runs();
    if (currentRuns.length === 0) return null;

    // Retornamos la última carrera del arreglo (asumiendo que vienen ordenadas por fecha)
    return currentRuns[currentRuns.length - 1];
  });

  viewRunDetails(runId: number | undefined) {
    if (!runId) return;
    // Navegamos al logbook pasando el ID como un fragmento (ancla)
    this.router.navigate(['/dashboard/logbook'], { fragment: `run-${runId}` });
  }
}
