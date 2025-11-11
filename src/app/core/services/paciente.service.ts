import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Patient } from '../models/patient.model';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  // Datos iniciales de ejemplo
  private initial: Patient[] = [
    {
      idPaciente: '1',
      nombrePaciente: 'Yef',
      correoPaciente: 'yef@example.com',
      telefonoPaciente: '3052232323',
      direccionPaciente: 'Calle 62A Sur',
      fechaNacimiento: '2004-12-24'
    },
    {
      idPaciente: '2',
      nombrePaciente: 'María Pérez',
      correoPaciente: 'maria@example.com',
      telefonoPaciente: '3001112222',
      direccionPaciente: 'Carrera 10 #5-20',
      fechaNacimiento: '1985-05-12'
    }
  ];

  private store$ = new BehaviorSubject<Patient[]>([...this.initial]);

  constructor() {}

  // Simular GET /pacientes
  getAll(): Observable<Patient[]> {
    // pequeño delay para simular llamada
    return this.store$.asObservable().pipe(delay(200));
  }

  // Simular GET /pacientes/{id}
  getById(id: string): Observable<Patient | undefined> {
    return this.getAll().pipe(
      map(list => list.find(p => p.idPaciente === id))
    );
  }

  // Simular POST /pacientes (crear)
  create(patient: Patient): Observable<Patient> {
    const current = this.store$.value;
    const newPatient = { ...patient };
    // si no tiene id, generamos uno simple (timestamp)
    if (!newPatient.idPaciente) {
      newPatient.idPaciente = String(Date.now());
    }
    this.store$.next([newPatient, ...current]);
    return of(newPatient).pipe(delay(200));
  }

  // Simular PUT /pacientes/{id}
  update(id: string, patient: Patient): Observable<Patient | undefined> {
    const list = this.store$.value.map(p => (p.idPaciente === id ? { ...patient } : p));
    this.store$.next(list);
    const updated = list.find(p => p.idPaciente === id);
    return of(updated).pipe(delay(200));
  }

  // Simular DELETE /pacientes/{id}
  delete(id: string): Observable<boolean> {
    const list = this.store$.value.filter(p => p.idPaciente !== id);
    this.store$.next(list);
    return of(true).pipe(delay(150));
  }

  // Buscar por texto (id o nombre)
  search(term: string): Observable<Patient[]> {
    const q = term?.trim().toLowerCase() ?? '';
    if (!q) return this.getAll();
    return this.getAll().pipe(
      map(list => list.filter(p =>
        p.idPaciente?.toLowerCase().includes(q) ||
        p.nombrePaciente?.toLowerCase().includes(q)
      ))
    );
  }
}
