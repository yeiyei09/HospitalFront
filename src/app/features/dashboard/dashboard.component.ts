import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacienteService } from '../../core/services/paciente.service';
import { MedicoService } from '../../core/services/medico.service';
import { EnfermeraService } from '../../core/services/enfermera.service';
import { CitaService } from '../../core/services/citas.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  totalPacientes = 0;
  totalMedicos = 0;
  totalEnfermeras = 0;
  totalCitas = 0;
  loading = true;
  error: string | null = null;

  constructor(
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
    private enfermeraService: EnfermeraService,
    private citaService: CitaService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    forkJoin({
      pacientes: this.pacienteService.getAll(),
      medicos: this.medicoService.getAll(),
      enfermeras: this.enfermeraService.getAll(),
      citas: this.citaService.getAll(),
    }).subscribe({
      next: ({ pacientes, medicos, enfermeras, citas }) => {
        this.totalPacientes = pacientes?.length ?? 0;
        this.totalMedicos = medicos?.length ?? 0;
        this.totalEnfermeras = enfermeras?.length ?? 0;
        this.totalCitas = citas?.length ?? 0;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al cargar estadísticas';
      },
      complete: () => (this.loading = false),
    });
  }
}