import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Enfermera } from '../models/enfermera.model';

@Injectable({
  providedIn: 'root',
})
export class EnfermeraService {
  private readonly endpoint = '/enfermeras';

  constructor(private apiService: ApiService) {}

  getAll(): Observable<Enfermera[]> {
    return this.apiService.get<Enfermera[]>(this.endpoint);
  }

  getPaginated(page: number, limit: number): Observable<Enfermera[]> {
    const skip = (page - 1) * limit;
    return this.apiService.get<Enfermera[]>(this.endpoint, { skip, limit });
  }

  getById(id: string): Observable<Enfermera> {
    return this.apiService.get<Enfermera>(`${this.endpoint}/${id}`);
  }

  create(enfermera: Partial<Enfermera>): Observable<Enfermera> {
    const { idEnfermera, ...body } = enfermera;
    return this.apiService.post<Enfermera>(this.endpoint, body);
  }

  update(id: string, enfermera: Partial<Enfermera>): Observable<Enfermera> {
    return this.apiService.put<Enfermera>(`${this.endpoint}/${id}`, enfermera);
  }

  delete(id: string): Observable<Enfermera> {
    return this.apiService.delete<Enfermera>(`${this.endpoint}/${id}`);
  }
}