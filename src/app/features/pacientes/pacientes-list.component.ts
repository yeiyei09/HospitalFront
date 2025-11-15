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
  styleUrls: ['./pacientes-list.component.scss'],
})
export class PacientesListComponent implements OnInit {
  pacientes: Paciente[] = [];
  searchTerm = '';
  searchId = '';
  showModal = false;
  editMode = false;
  selectedPaciente: Paciente = this.getEmptyPaciente();
  loading = false;
  currentPage = 1;     
  itemsPerPage = 5; 

  constructor(private pacienteService: PacienteService) {}

  ngOnInit(): void {
    this.loadPacientes();
  }

  /** ✅ Este es el método que falta */
  loadPacientes() {
    this.loading = true;
    this.pacienteService.getPaginated(this.currentPage, this.itemsPerPage).subscribe({
      next: (data) => {
        this.pacientes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar pacientes', err);
        this.loading = false;
      },
    });
  }

  nextPage() {
    this.currentPage++;
    this.loadPacientes();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPacientes();
    }
  }

  /** Restablece la tabla completa */
  verTodos() {
    this.searchId = '';
    this.currentPage = 1;
    this.loadPacientes();
  }

  get filteredPacientes(): Paciente[] {
    return this.pacientes.filter(
      (p) =>
        p.nombrePaciente?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (p.cedulaPaciente || '')
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
    );
  }

  buscarPorId() {
    if (!this.searchId) {
      alert('Por favor ingresa un ID para buscar.');
      return;
    }

    this.loading = true;

    this.pacienteService.getById(this.searchId).subscribe({
      next: (paciente) => {
        // Muestra únicamente el paciente encontrado
        this.pacientes = [paciente];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al buscar paciente por ID', err);
        alert('No se encontró ningún paciente con ese ID.');
      },
    });
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
    const paciente = { ...this.selectedPaciente };

    if (this.editMode && paciente.idPaciente) {
      this.pacienteService.update(paciente.idPaciente, paciente).subscribe({
        next: () => this.loadPacientes(),
        error: (err) => console.error('Error al actualizar', err),
      });
    } else {
      this.pacienteService.create(paciente).subscribe({
        next: () => this.loadPacientes(),
        error: (err) => console.error('Error al crear', err),
      });
    }

    this.closeModal();
  }

  deletePaciente(id: string) {
    if (confirm('¿Seguro que deseas eliminar este paciente?')) {
      this.pacienteService.delete(id).subscribe({
        next: () => this.loadPacientes(),
        error: (err) => console.error('Error al eliminar', err),
      });
    }
  }

  private getEmptyPaciente(): Paciente {
    return {
    nombrePaciente: '',
    correoPaciente: '',
    telefonoPaciente: '',
    cedulaPaciente: '',
    direccionPaciente: '',
    fechaNacimiento: ''
    };
  }
}