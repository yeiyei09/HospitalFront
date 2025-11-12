import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Paciente } from '../models/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  // Datos mock iniciales
  private pacientesData: Paciente[] = [
    {
      idPaciente: 'P001',
      nombrePaciente: 'Carlos Pérez',
      correoPaciente: 'carlos@example.com',
      telefonoPaciente: '3001234567',
      direccionPaciente: 'Calle 45 #12-34',
      fechaNacimiento: '1990-05-10'
    },
    {
      idPaciente: 'P002',
      nombrePaciente: 'María Gómez',
      correoPaciente: 'maria@example.com',
      telefonoPaciente: '3105678901',
      direccionPaciente: 'Carrera 8 #23-45',
      fechaNacimiento: '1985-09-15'
    }
  ];

  // BehaviorSubject para manejar cambios reactivos
  private pacientesSubject = new BehaviorSubject<Paciente[]>(this.pacientesData);
  pacientes$: Observable<Paciente[]> = this.pacientesSubject.asObservable();

  // Obtener todos los pacientes
  getAll(): Observable<Paciente[]> {
    return this.pacientes$;
  }

  // Agregar un nuevo paciente
  add(paciente: Paciente): void {
    // Si no se define un id, se genera automáticamente
    if (!paciente.idPaciente) {
      paciente.idPaciente = `P${(this.pacientesData.length + 1).toString().padStart(3, '0')}`;
    }
    this.pacientesData.push(paciente);
    this.pacientesSubject.next([...this.pacientesData]);
  }

  // Actualizar un paciente existente
  update(paciente: Paciente): void {
    const index = this.pacientesData.findIndex(p => p.idPaciente === paciente.idPaciente);
    if (index !== -1) {
      this.pacientesData[index] = { ...paciente };
      this.pacientesSubject.next([...this.pacientesData]);
    }
  }

  // Eliminar paciente por ID
  delete(id: string): void {
    this.pacientesData = this.pacientesData.filter(p => p.idPaciente !== id);
    this.pacientesSubject.next([...this.pacientesData]);
  }
}
