import { Injectable } from '@angular/core';
import { Enfermera } from '../models/enfermera.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnfermeraService {
  private enfermerasData: Enfermera[] = [
    {
      idEnfermera: 'E001',
      nombreEnfermera: 'Laura Gómez',
      correoEnfermera: 'laura.gomez@example.com',
      telefonoEnfermera: '3004567890',
      especialidad: 'Pediatría',
      numeroColegiatura: 'NC-12345'
    },
    {
      idEnfermera: 'E002',
      nombreEnfermera: 'María Torres',
      correoEnfermera: 'maria.torres@example.com',
      telefonoEnfermera: '3019876543',
      especialidad: 'Urgencias',
      numeroColegiatura: 'NC-54321'
    }
  ];

  private enfermerasSubject = new BehaviorSubject<Enfermera[]>(this.enfermerasData);
  enfermeras$: Observable<Enfermera[]> = this.enfermerasSubject.asObservable();

  getAll(): Observable<Enfermera[]> {
    return this.enfermeras$;
  }

  add(enfermera: Enfermera): void {
    this.enfermerasData.push(enfermera);
    this.enfermerasSubject.next([...this.enfermerasData]);
  }

  update(enfermera: Enfermera): void {
    const index = this.enfermerasData.findIndex(e => e.idEnfermera === enfermera.idEnfermera);
    if (index !== -1) {
      this.enfermerasData[index] = enfermera;
      this.enfermerasSubject.next([...this.enfermerasData]);
    }
  }

  delete(id: string): void {
    this.enfermerasData = this.enfermerasData.filter(e => e.idEnfermera !== id);
    this.enfermerasSubject.next([...this.enfermerasData]);
  }
}
