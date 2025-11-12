import { Component, OnInit } from '@angular/core';
import { Cita } from '../../core/models/citas.model';
import { CitaService } from '../../core/services/citas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-citas-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './citas-list.component.html',
  styleUrls: ['./citas-list.component.scss']
})
export class CitasListComponent implements OnInit {
  citas: Cita[] = [];
  searchTerm = '';
  showModal = false;
  editMode = false;
  selectedCita: Cita = this.getEmptyCita();

  constructor(private citaService: CitaService) {}

  ngOnInit(): void {
    this.citaService.getAll().subscribe(data => (this.citas = data));
  }

  get filteredCitas(): Cita[] {
    return this.citas.filter(c =>
      c.idCita?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      c.idPaciente.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      c.idMedico.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      c.motivoConsulta.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
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
    if (this.editMode) {
      this.citaService.update(this.selectedCita);
    } else {
      this.citaService.add({ ...this.selectedCita });
    }
    this.closeModal();
  }

  deleteCita(id: string) {
    if (confirm('¿Seguro que deseas eliminar esta cita?')) {
      this.citaService.delete(id);
    }
  }

  private getEmptyCita(): Cita {
    return {
      idCita: '',
      idPaciente: '',
      idMedico: '',
      fechaAgendamiento: '',
      motivoConsulta: '',
      fechaEmision: ''
    };
  }
}
