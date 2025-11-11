import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Cita } from '../models/citas.model';

@Injectable({ providedIn: 'root' })
export class CitaService {
  private citas: Cita[] = [
    {
      idCita: '1',
      idPaciente: '1',
      idMedico: '2',
      fechaAgendamiento: '2025-11-11',
      motivoConsulta: 'Chequeo general',
      fechaEmision: '2025-11-10'
    },
    {
      idCita: '2',
      idPaciente: '3',
      idMedico: '1',
      fechaAgendamiento: '2025-11-12',
      motivoConsulta: 'Dolor de cabeza',
      fechaEmision: '2025-11-10'
    }
  ];

  getAll(): Observable<Cita[]> {
    return of(this.citas).pipe(delay(300));
  }

  create(cita: Cita): Observable<void> {
    cita.idCita = (this.citas.length + 1).toString();
    this.citas.push(cita);
    return of(void 0).pipe(delay(300));
  }

  update(id: string, cita: Cita): Observable<void> {
    const idx = this.citas.findIndex(c => c.idCita === id);
    if (idx !== -1) this.citas[idx] = cita;
    return of(void 0).pipe(delay(300));
  }

  delete(id: string): Observable<void> {
    this.citas = this.citas.filter(c => c.idCita !== id);
    return of(void 0).pipe(delay(300));
  }

  search(term: string): Observable<Cita[]> {
    const t = term.toLowerCase();
    const filtered = this.citas.filter(
      c =>
        c.idCita?.includes(t) ||
        c.idPaciente.toLowerCase().includes(t) ||
        c.idMedico.toLowerCase().includes(t) ||
        c.motivoConsulta.toLowerCase().includes(t)
    );
    return of(filtered).pipe(delay(300));
  }
}
