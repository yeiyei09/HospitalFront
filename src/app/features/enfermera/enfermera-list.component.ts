import { Component, OnInit } from '@angular/core';
import { Enfermera } from '../../core/models/enfermera.model';
import { EnfermeraService } from '../../core/services/enfermera.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-enfermera-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enfermera-list.component.html',
  styleUrls: ['./enfermera-list.component.scss']
})
export class EnfermeraListComponent implements OnInit {
  enfermeras: Enfermera[] = [];
  searchTerm = '';
  showModal = false;
  editMode = false;
  selectedEnfermera: Enfermera = this.getEmptyEnfermera();

  constructor(private enfermeraService: EnfermeraService) {}

  ngOnInit(): void {
    this.enfermeraService.getAll().subscribe(data => this.enfermeras = data);
  }

  get filteredEnfermeras(): Enfermera[] {
    return this.enfermeras.filter(e =>
      e.nombreEnfermera.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      e.idEnfermera.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
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
    if (this.editMode) {
      this.enfermeraService.update(this.selectedEnfermera);
    } else {
      this.enfermeraService.add({ ...this.selectedEnfermera });
    }
    this.closeModal();
  }

  deleteEnfermera(id: string) {
    if (confirm('¿Seguro que deseas eliminar esta enfermera?')) {
      this.enfermeraService.delete(id);
    }
  }

  private getEmptyEnfermera(): Enfermera {
    return {
      idEnfermera: '',
      nombreEnfermera: '',
      correoEnfermera: '',
      telefonoEnfermera: '',
      especialidad: '',
      numeroColegiatura: ''
    };
  }
}
