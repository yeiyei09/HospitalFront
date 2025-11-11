import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CitaService } from '../../core/services/citas.service';
import { Cita } from '../../core/models/citas.model';

@Component({
  selector: 'app-citas-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './citas-list.component.html',
  styleUrls: ['./citas-list.component.scss']
})
export class CitasListComponent implements OnInit {
  citas: Cita[] = [];
  loading = false;
  searchTerm = '';

  showModal = false;
  editing = false;
  current: Cita = this.emptyCita();

  constructor(private service: CitaService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  emptyCita(): Cita {
    return {
      idPaciente: '',
      idMedico: '',
      fechaAgendamiento: '',
      motivoConsulta: '',
      fechaEmision: ''
    };
  }

  loadAll(): void {
    this.loading = true;
    this.service.getAll().subscribe(list => {
      this.citas = list;
      this.loading = false;
    });
  }

  openCreate(): void {
    this.editing = false;
    this.current = this.emptyCita();
    this.showModal = true;
  }

  openEdit(cita: Cita): void {
    this.editing = true;
    this.current = { ...cita };
    this.showModal = true;
  }

  save(form: NgForm): void {
    if (form.invalid) return;
    this.loading = true;

    if (this.editing && this.current.idCita) {
      this.service.update(this.current.idCita, this.current).subscribe(() => {
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

  delete(cita: Cita): void {
    if (!confirm(`¿Eliminar cita #${cita.idCita}?`)) return;
    this.service.delete(cita.idCita!).subscribe(() => this.loadAll());
  }

  doSearch(): void {
    if (!this.searchTerm) {
      this.loadAll();
      return;
    }
    this.loading = true;
    this.service.search(this.searchTerm).subscribe(list => {
      this.citas = list;
      this.loading = false;
    });
  }

  closeModal(): void {
    this.showModal = false;
  }
}
