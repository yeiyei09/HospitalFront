import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Medico } from '../../core/models/medico.model';
import { MedicoService } from '../../core/services/medico.service';

@Component({
  selector: 'app-medico-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medico-list.component.html',
  styleUrls: ['./medico-list.component.scss'],
})
export class MedicosListComponent implements OnInit {
  medicos: Medico[] = [];
  searchTerm = '';
  searchId = '';
  showModal = false;
  editMode = false;
  selectedMedico: Medico = this.getEmptyMedico();
  loading = false;

  // 🔹 Paginación
  currentPage = 1;
  itemsPerPage = 5;

  constructor(private medicoService: MedicoService) {}

  ngOnInit(): void {
    this.loadMedicos();
  }

  loadMedicos() {
    this.loading = true;
    this.medicoService.getPaginated(this.currentPage, this.itemsPerPage).subscribe({
      next: (data) => {
        this.medicos = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar médicos', err);
        this.loading = false;
      },
    });
  }

  /** Filtros por nombre o cédula */
  get filteredMedicos(): Medico[] {
    return this.medicos.filter(
      (m) =>
        m.nombreMedico.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (m.cedulaMedico || '')
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
    );
  }

  /** Buscar por ID (GET backend) */
  buscarPorId() {
    if (!this.searchId) {
      alert('Ingrese un ID para buscar.');
      return;
    }

    this.loading = true;
    this.medicoService.getById(this.searchId).subscribe({
      next: (medico) => {
        this.medicos = [medico];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al buscar por ID', err);
        alert('No se encontró ningún médico con ese ID.');
      },
    });
  }

  verTodos() {
    this.searchId = '';
    this.currentPage = 1;
    this.loadMedicos();
  }

  openModal(medico?: Medico) {
    this.showModal = true;
    this.editMode = !!medico;
    this.selectedMedico = medico ? { ...medico } : this.getEmptyMedico();
  }

  closeModal() {
    this.showModal = false;
  }

  saveMedico() {
    const medico = { ...this.selectedMedico };

    if (this.editMode && medico.idMedico) {
      this.medicoService.update(medico.idMedico, medico).subscribe({
        next: () => this.loadMedicos(),
        error: (err) => console.error('Error al actualizar', err),
      });
    } else {
      this.medicoService.create(medico).subscribe({
        next: () => this.loadMedicos(),
        error: (err) => console.error('Error al crear', err),
      });
    }

    this.closeModal();
  }

  deleteMedico(id?: string) {
  if (!id) {
    console.error('El ID de médico es inválido o indefinido.');
    return;
  }

  if (confirm('¿Seguro que deseas eliminar este médico?')) {
    this.medicoService.delete(id).subscribe({
      next: () => this.loadMedicos(),
      error: (err) => console.error('Error al eliminar', err),
    });
  }
}

  nextPage() {
    this.currentPage++;
    this.loadMedicos();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadMedicos();
    }
  }

  private getEmptyMedico(): Medico {
    return {
      nombreMedico: '',
      correoMedico: '',
      telefonoMedico: '',
      cedulaMedico: '',
      especializacion: '',
      numeroColegiatura: '',
    };
  }
}