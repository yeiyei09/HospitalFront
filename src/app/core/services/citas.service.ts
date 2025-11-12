import { Injectable } from '@angular/core';
import { Cita } from '../models/citas.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private citasData: Cita[] = [
    {
      idCita: 'C001',
      idPaciente: 'P001',
      idMedico: 'M001',
      fechaAgendamiento: '2025-11-15T10:00',
      motivoConsulta: 'Chequeo general',
      fechaEmision: '2025-11-10'
    },
    {
      idCita: 'C002',
      idPaciente: 'P002',
      idMedico: 'M003',
      fechaAgendamiento: '2025-11-20T14:00',
      motivoConsulta: 'Dolor de cabeza persistente',
      fechaEmision: '2025-11-11'
    }
  ];

  private citasSubject = new BehaviorSubject<Cita[]>(this.citasData);
  citas$: Observable<Cita[]> = this.citasSubject.asObservable();

  getAll(): Observable<Cita[]> {
    return this.citas$;
  }

  add(cita: Cita): void {
    this.citasData.push(cita);
    this.citasSubject.next([...this.citasData]);
  }

  update(cita: Cita): void {
    const index = this.citasData.findIndex(c => c.idCita === cita.idCita);
    if (index !== -1) {
      this.citasData[index] = cita;
      this.citasSubject.next([...this.citasData]);
    }
  }

  delete(id: string): void {
    this.citasData = this.citasData.filter(c => c.idCita !== id);
    this.citasSubject.next([...this.citasData]);
  }
}
