import { Injectable } from '@angular/core';
import { Medico } from '../models/medico.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  private medicosData: Medico[] = [
    {
      idMedico: 'M001',
      nombreMedico: 'Carlos Pérez',
      correoMedico: 'carlos.perez@example.com',
      telefonoMedico: '3009876543',
      especialidad: 'Cardiología',
      numeroColegiatura: 'MC-10001'
    },
    {
      idMedico: 'M002',
      nombreMedico: 'Ana Martínez',
      correoMedico: 'ana.martinez@example.com',
      telefonoMedico: '3101234567',
      especialidad: 'Neurología',
      numeroColegiatura: 'MC-10002'
    }
  ];

  private medicosSubject = new BehaviorSubject<Medico[]>(this.medicosData);
  medicos$: Observable<Medico[]> = this.medicosSubject.asObservable();

  getAll(): Observable<Medico[]> {
    return this.medicos$;
  }

  add(medico: Medico): void {
    this.medicosData.push(medico);
    this.medicosSubject.next([...this.medicosData]);
  }

  update(medico: Medico): void {
    const index = this.medicosData.findIndex(m => m.idMedico === medico.idMedico);
    if (index !== -1) {
      this.medicosData[index] = medico;
      this.medicosSubject.next([...this.medicosData]);
    }
  }

  delete(id: string): void {
    this.medicosData = this.medicosData.filter(m => m.idMedico !== id);
    this.medicosSubject.next([...this.medicosData]);
  }
}
