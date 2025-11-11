import { Component, OnInit } from '@angular/core';
import { MedicoService } from '../../core/services/medico.service';
import { Medico } from '../../core/models/medico.model';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-medicos-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medico-list.component.html',
  styleUrls: ['./medico-list.component.scss']
})
export class MedicosListComponent implements OnInit {
  medicos: Medico[] = [];
  loading = false;
  searchTerm = '';

  // Modal state
  showModal = false;
  editing = false;
  current: Medico = this.emptyMedico();

  constructor(private service: MedicoService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  emptyMedico(): Medico {
    return {
      idMedico: '',
      nombreMedico: '',
      correoMedico: '',
      telefonoMedico: '',
      especialidad: '',
      numeroColegiatura: ''
    };
  }

  loadAll(): void {
    this.loading = true;
    this.service.getAll().subscribe(list => {
      this.medicos = list;
      this.loading = false;
    });
  }

  openCreate(): void {
    this.editing = false;
    this.current = this.emptyMedico();
    this.showModal = true;
  }

  openEdit(p: Medico): void {
    this.editing = true;
    // clonar
    this.current = { ...p };
    this.showModal = true;
  }

  save(form: NgForm): void {
    if (form.invalid) return;
    this.loading = true;
    if (this.editing) {
      this.service.update(this.current.idMedico, this.current).subscribe(() => {
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

  delete(p: Medico): void {
    if (!confirm(`Eliminar medico ${p.nombreMedico}?`)) return;
    this.service.delete(p.idMedico).subscribe(() => this.loadAll());
  }

  doSearch(): void {
    if (!this.searchTerm) {
      this.loadAll();
      return;
    }
    this.loading = true;
    this.service.search(this.searchTerm).subscribe(list => {
      this.medicos = list;
      this.loading = false;
    });
  }

  closeModal(): void {
    this.showModal = false;
  }
}
