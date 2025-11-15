import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cita } from '../../core/models/citas.model';
import { CitaService } from '../../core/services/citas.service';

@Component({
  selector: 'app-citas-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './citas-list.component.html',
  styleUrls: ['./citas-list.component.scss'],
})
export class CitasListComponent implements OnInit {
  citas: Cita[] = [];
  searchTerm = '';
  searchId = '';
  showModal = false;
  editMode = false;
  selectedCita: Cita = this.getEmptyCita();
  loading = false;

  currentPage = 1;
  itemsPerPage = 5;

  constructor(private citaService: CitaService) {}

  ngOnInit(): void {
    this.loadCitas();
  }

  loadCitas() {
    this.loading = true;
    this.citaService.getPaginated(this.currentPage, this.itemsPerPage).subscribe({
      next: (data) => { this.citas = data; this.loading = false; },
      error: (err) => { console.error('Error al cargar citas', err); this.loading = false; },
    });
  }

  get filteredCitas(): Cita[] {
    return this.citas.filter(c =>
      c.motivoConsulta.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      c.idPaciente.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  buscarPorId() {
    if (!this.searchId) { alert('Ingrese un ID de cita'); return; }
    this.loading = true;
    this.citaService.getById(this.searchId).subscribe({
      next: (cita) => { this.citas = [cita]; this.loading = false; },
      error: (err) => { console.error(err); this.loading = false; alert('No se encontró cita con ese ID.'); },
    });
  }

  verTodas() {
    this.searchId = '';
    this.currentPage = 1;
    this.loadCitas();
  }

  openModal(cita?: Cita) {
    this.showModal = true;
    this.editMode = !!cita;
    this.selectedCita = cita ? { ...cita } : this.getEmptyCita();
  }

  closeModal() {
    this.showModal = false;
  }

  saveCita() {
    const cita = { ...this.selectedCita };

    if (this.editMode && cita.idCita) {
      this.citaService.update(cita.idCita, cita).subscribe({
        next: () => this.loadCitas(),
        error: (err) => console.error('Error al actualizar', err),
      });
    } else {
      this.citaService.create(cita).subscribe({
        next: () => this.loadCitas(),
        error: (err) => console.error('Error al crear', err),
      });
    }

    this.closeModal();
  }

  deleteCita(id?: string) {
    if (!id) return;
    if (confirm('¿Seguro que deseas eliminar esta cita?')) {
      this.citaService.delete(id).subscribe({
        next: () => this.loadCitas(),
        error: (err) => console.error('Error al eliminar', err),
      });
    }
  }

  nextPage() { this.currentPage++; this.loadCitas(); }
  prevPage() { if (this.currentPage > 1) { this.currentPage--; this.loadCitas(); } }

  private getEmptyCita(): Cita {
    return {
      idPaciente: '',
      idMedico: '',
      fechaAgendamiento: '',
      motivoConsulta: '',
      fechaEmision: '',
    };
  }
}