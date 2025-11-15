import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Paciente } from '../models/paciente.model';

@Injectable({
  providedIn: 'root',
})
export class PacienteService {
  private readonly endpoint = '/pacientes';

  constructor(private apiService: ApiService) {}

  /**
   * Obtener todos los pacientes
   */
  getAll(): Observable<Paciente[]> {
    return this.apiService.get<Paciente[]>(this.endpoint);
  }

  /**
   * Obtener un paciente por ID
   */
  getById(id: string): Observable<Paciente> {
    return this.apiService.get<Paciente>(`${this.endpoint}/${id}`);
  }

  /**
   * Crear un nuevo paciente
   */
  create(paciente: Partial<Paciente>): Observable<Paciente> {
  // ❌ No enviar idPaciente si está presente
  const { idPaciente, ...body } = paciente;
  return this.apiService.post<Paciente>(this.endpoint, body);
}

  /**
   * Actualizar un paciente
   */
  update(id: string, paciente: Partial<Paciente>): Observable<Paciente> {
    return this.apiService.put<Paciente>(`${this.endpoint}/${id}`, paciente);
  }

  /**
   * Eliminar un paciente
   */
  delete(id: string): Observable<Paciente> {
    return this.apiService.delete<Paciente>(`${this.endpoint}/${id}`);
  }
  
  getPaginated(page: number, limit: number): Observable<Paciente[]> {
  const skip = (page - 1) * limit;
  const params = { skip, limit };
  return this.apiService.get<Paciente[]>('/pacientes', params);
  }
}