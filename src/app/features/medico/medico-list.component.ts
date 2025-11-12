import { Component, OnInit } from '@angular/core';
import { Medico } from '../../core/models/medico.model';
import { MedicoService } from '../../core/services/medico.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-medico-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medico-list.component.html',
  styleUrls: ['./medico-list.component.scss']
})
export class MedicosListComponent implements OnInit {
  medicos: Medico[] = [];
  searchTerm = '';
  showModal = false;
  editMode = false;
  selectedMedico: Medico = this.getEmptyMedico();

  constructor(private medicoService: MedicoService) {}

  ngOnInit(): void {
    this.medicoService.getAll().subscribe(data => this.medicos = data);
  }

  get filteredMedicos(): Medico[] {
    return this.medicos.filter(m =>
      m.nombreMedico.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      m.idMedico.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
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
    if (this.editMode) {
      this.medicoService.update(this.selectedMedico);
    } else {
      this.medicoService.add({ ...this.selectedMedico });
    }
    this.closeModal();
  }

  deleteMedico(id: string) {
    if (confirm('¿Seguro que deseas eliminar este médico?')) {
      this.medicoService.delete(id);
    }
  }

  private getEmptyMedico(): Medico {
    return {
      idMedico: '',
      nombreMedico: '',
      correoMedico: '',
      telefonoMedico: '',
      especialidad: '',
      numeroColegiatura: ''
    };
  }
}
