import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Cita } from '../models/citas.model';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private readonly endpoint = '/citas';

  constructor(private apiService: ApiService) {}

  /** Obtener todas las citas */
  getAll(): Observable<Cita[]> {
    return this.apiService.get<Cita[]>(this.endpoint);
  }

  /** Paginadas */
  getPaginated(page: number, limit: number): Observable<Cita[]> {
    const skip = (page - 1) * limit;
    return this.apiService.get<Cita[]>(this.endpoint, { skip, limit });
  }

  /** Obtener por ID */
  getById(id: string): Observable<Cita> {
    return this.apiService.get<Cita>(`${this.endpoint}/${id}`);
  }

  /** Crear nueva cita */
  create(cita: Partial<Cita>): Observable<Cita> {
    const { idCita, ...body } = cita;
    return this.apiService.post<Cita>(this.endpoint, body);
  }

  /** Actualizar cita existente */
  update(id: string, cita: Partial<Cita>): Observable<Cita> {
    return this.apiService.put<Cita>(`${this.endpoint}/${id}`, cita);
  }

  /** Eliminar cita */
  delete(id: string): Observable<Cita> {
    return this.apiService.delete<Cita>(`${this.endpoint}/${id}`);
  }
}