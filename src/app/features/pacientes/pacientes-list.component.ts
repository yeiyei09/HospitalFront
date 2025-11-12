import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PacienteService } from '../../core/services/paciente.service';
import { Paciente } from '../../core/models/paciente.model';

@Component({
  selector: 'app-pacientes-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pacientes-list.component.html',
  styleUrls: ['./pacientes-list.component.scss']
})
export class PacientesListComponent implements OnInit {
  pacientes: Paciente[] = [];
  searchTerm = '';
  showModal = false;
  editMode = false;
  selectedPaciente: Paciente = this.getEmptyPaciente();

  constructor(private pacienteService: PacienteService) {}

  ngOnInit(): void {
    this.pacienteService.getAll().subscribe(data => this.pacientes = data);
  }

  get filteredPacientes(): Paciente[] {
    return this.pacientes.filter(p =>
      p.nombrePaciente.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.idPaciente?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openModal(paciente?: Paciente) {
    this.showModal = true;
    this.editMode = !!paciente;
    this.selectedPaciente = paciente ? { ...paciente } : this.getEmptyPaciente();
  }

  closeModal() {
    this.showModal = false;
  }

  savePaciente() {
    if (this.editMode) {
      this.pacienteService.update(this.selectedPaciente);
    } else {
      this.pacienteService.add({ ...this.selectedPaciente });
    }
    this.closeModal();
  }

  deletePaciente(id: string) {
    if (confirm('¿Seguro que deseas eliminar este paciente?')) {
      this.pacienteService.delete(id);
    }
  }

  private getEmptyPaciente(): Paciente {
    return {
      idPaciente: '',
      nombrePaciente: '',
      correoPaciente: '',
      telefonoPaciente: '',
      direccionPaciente: '',
      fechaNacimiento: ''
    };
  }
}
