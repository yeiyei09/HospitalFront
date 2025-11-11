import { Component, OnInit } from '@angular/core';
import { PacienteService } from '../../core/services/paciente.service';
import { Patient } from '../../core/models/patient.model';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pacientes-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pacientes-list.component.html',
  styleUrls: ['./pacientes-list.component.scss']
})
export class PacientesListComponent implements OnInit {
  patients: Patient[] = [];
  loading = false;
  searchTerm = '';

  // Modal state
  showModal = false;
  editing = false;
  current: Patient = this.emptyPatient();

  constructor(private service: PacienteService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  emptyPatient(): Patient {
    return {
      idPaciente: '',
      nombrePaciente: '',
      correoPaciente: '',
      telefonoPaciente: '',
      direccionPaciente: '',
      fechaNacimiento: ''
    };
  }

  loadAll(): void {
    this.loading = true;
    this.service.getAll().subscribe(list => {
      this.patients = list;
      this.loading = false;
    });
  }

  openCreate(): void {
    this.editing = false;
    this.current = this.emptyPatient();
    this.showModal = true;
  }

  openEdit(p: Patient): void {
    this.editing = true;
    // clonar
    this.current = { ...p };
    this.showModal = true;
  }

  save(form: NgForm): void {
    if (form.invalid) return;
    this.loading = true;
    if (this.editing) {
      this.service.update(this.current.idPaciente, this.current).subscribe(() => {
        this.loadAll();
        this.showModal = false;
        this.loading = false;
      });
    } else {
      this.service.create(this.current).subscribe(() => {
        this.loadAll();
        this.showModal = false;
        this.loading = false;
      });
    }
  }

  delete(p: Patient): void {
    if (!confirm(`Eliminar paciente ${p.nombrePaciente}?`)) return;
    this.service.delete(p.idPaciente).subscribe(() => this.loadAll());
  }

  doSearch(): void {
    if (!this.searchTerm) {
      this.loadAll();
      return;
    }
    this.loading = true;
    this.service.search(this.searchTerm).subscribe(list => {
      this.patients = list;
      this.loading = false;
    });
  }

  closeModal(): void {
    this.showModal = false;
  }
}
