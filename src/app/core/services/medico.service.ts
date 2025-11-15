import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Medico } from '../models/medico.model';

@Injectable({
  providedIn: 'root',
})
export class MedicoService {
  private readonly endpoint = '/medicos';

  constructor(private apiService: ApiService) {}

  /** Obtener todos los médicos */
  getAll(): Observable<Medico[]> {
    return this.apiService.get<Medico[]>(this.endpoint);
  }

  /** Obtener médicos paginados */
  getPaginated(page: number, limit: number): Observable<Medico[]> {
    const skip = (page - 1) * limit;
    const params = { skip, limit };
    return this.apiService.get<Medico[]>(this.endpoint, params);
  }

  /** Obtener médico por ID */
  getById(id: string): Observable<Medico> {
    return this.apiService.get<Medico>(`${this.endpoint}/${id}`);
  }

  /** Crear nuevo médico */
  create(medico: Partial<Medico>): Observable<Medico> {
    const { idMedico, ...body } = medico;
    return this.apiService.post<Medico>(this.endpoint, body);
  }

  /** Actualizar médico existente */
  update(id: string, medico: Partial<Medico>): Observable<Medico> {
    return this.apiService.put<Medico>(`${this.endpoint}/${id}`, medico);
  }

  /** Eliminar médico */
  delete(id: string): Observable<Medico> {
    return this.apiService.delete<Medico>(`${this.endpoint}/${id}`);
  }
}