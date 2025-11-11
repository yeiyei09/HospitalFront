import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Medico } from '../models/medico.model';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  // Datos iniciales de ejemplo
  private initial: Medico[] = [
    {
      idMedico: '1',
      nombreMedico: 'Rei',
      correoMedico: 'rei@example.com',
      telefonoMedico: '3052232323',
      especialidad: 'Cirugia',
      numeroColegiatura: '4113'
    },
    {
      idMedico: '2',
      nombreMedico: 'Juan Pérez',
      correoMedico: 'jp@example.com',
      telefonoMedico: '3001112222',
      especialidad: 'Pediatria',
      numeroColegiatura: '4413'
    }
  ];

  private store$ = new BehaviorSubject<Medico[]>([...this.initial]);

  constructor() {}

  // Simular GET /medico
  getAll(): Observable<Medico[]> {
    // pequeño delay para simular llamada
    return this.store$.asObservable().pipe(delay(200));
  }

  // Simular GET /medico/{id}
  getById(id: string): Observable<Medico | undefined> {
    return this.getAll().pipe(
      map(list => list.find(p => p.idMedico === id))
    );
  }

  // Simular POST /medico (crear)
  create(medico: Medico): Observable<Medico> {
    const current = this.store$.value;
    const newMedico = { ...medico };
    // si no tiene id, generamos uno simple (timestamp)
    if (!newMedico.idMedico) {
      newMedico.idMedico = String(Date.now());
    }
    this.store$.next([newMedico, ...current]);
    return of(newMedico).pipe(delay(200));
  }

  // Simular PUT /medico/{id}
  update(id: string, patient: Medico): Observable<Medico | undefined> {
    const list = this.store$.value.map(p => (p.idMedico === id ? { ...patient } : p));
    this.store$.next(list);
    const updated = list.find(p => p.idMedico === id);
    return of(updated).pipe(delay(200));
  }

  // Simular DELETE /medico/{id}
  delete(id: string): Observable<boolean> {
    const list = this.store$.value.filter(p => p.idMedico !== id);
    this.store$.next(list);
    return of(true).pipe(delay(150));
  }

  // Buscar por texto (id o nombre)
  search(term: string): Observable<Medico[]> {
    const q = term?.trim().toLowerCase() ?? '';
    if (!q) return this.getAll();
    return this.getAll().pipe(
      map(list => list.filter(p =>
        p.idMedico?.toLowerCase().includes(q) ||
        p.idMedico?.toLowerCase().includes(q)
      ))
    );
  }
}