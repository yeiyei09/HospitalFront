import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Enfermera } from '../../core/models/enfermera.model';
import { EnfermeraService } from '../../core/services/enfermera.service';

@Component({
  selector: 'app-enfermera-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enfermera-list.component.html',
  styleUrls: ['./enfermera-list.component.scss'],
})
export class EnfermeraListComponent implements OnInit {
  enfermeras: Enfermera[] = [];
  searchTerm = '';
  searchId = '';
  showModal = false;
  editMode = false;
  selectedEnfermera: Enfermera = this.getEmptyEnfermera();
  loading = false;

  currentPage = 1;
  itemsPerPage = 5;

  constructor(private enfermeraService: EnfermeraService) {}

  ngOnInit(): void {
    this.loadEnfermeras();
  }

  loadEnfermeras() {
    this.loading = true;
    this.enfermeraService.getPaginated(this.currentPage, this.itemsPerPage).subscribe({
      next: (data) => {
        this.enfermeras = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar enfermeras', err);
        this.loading = false;
      },
    });
  }

  get filteredEnfermeras(): Enfermera[] {
    return this.enfermeras.filter(
      (e) =>
        e.nombreEnfermera.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (e.cedulaEnfermera || '').toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  buscarPorId() {
    if (!this.searchId) {
      alert('Ingrese un ID para buscar.');
      return;
    }

    this.loading = true;
    this.enfermeraService.getById(this.searchId).subscribe({
      next: (enfermera) => {
        this.enfermeras = [enfermera];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al buscar por ID', err);
        alert('No se encontró ninguna enfermera con ese ID.');
      },
    });
  }

  verTodos() {
    this.searchId = '';
    this.currentPage = 1;
    this.loadEnfermeras();
  }

  openModal(enfermera?: Enfermera) {
    this.showModal = true;
    this.editMode = !!enfermera;
    this.selectedEnfermera = enfermera ? { ...enfermera } : this.getEmptyEnfermera();
  }

  closeModal() {
    this.showModal = false;
  }

  saveEnfermera() {
    const enfermera = { ...this.selectedEnfermera };

    if (this.editMode && enfermera.idEnfermera) {
      this.enfermeraService.update(enfermera.idEnfermera, enfermera).subscribe({
        next: () => this.loadEnfermeras(),
        error: (err) => console.error('Error al actualizar', err),
      });
    } else {
      this.enfermeraService.create(enfermera).subscribe({
        next: () => this.loadEnfermeras(),
        error: (err) => console.error('Error al crear', err),
      });
    }

    this.closeModal();
  }

  deleteEnfermera(id?: string) {
    if (!id) return;
    if (confirm('¿Seguro que deseas eliminar esta enfermera?')) {
      this.enfermeraService.delete(id).subscribe({
        next: () => this.loadEnfermeras(),
        error: (err) => console.error('Error al eliminar', err),
      });
    }
  }

  nextPage() {
    this.currentPage++;
    this.loadEnfermeras();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadEnfermeras();
    }
  }

  private getEmptyEnfermera(): Enfermera {
    return {
      nombreEnfermera: '',
      correoEnfermera: '',
      telefonoEnfermera: '',
      cedulaEnfermera: '',
      areaEnfermera: '',
    };
  }
}