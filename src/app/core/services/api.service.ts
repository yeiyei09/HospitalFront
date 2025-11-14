import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginationParams } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Realiza una petición GET
   */
  get<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { params: httpParams });
  }

  /**
   * Realiza una petición GET paginada
   */
  getPaginated<T>(endpoint: string, pagination: PaginationParams, filters?: any): Observable<T[]> {
    let httpParams = new HttpParams();

    httpParams = httpParams.set('skip', pagination.page.toString());
    httpParams = httpParams.set('limit', pagination.limit.toString());

    if (pagination.sort) httpParams = httpParams.set('sort', pagination.sort);
    if (pagination.order) httpParams = httpParams.set('order', pagination.order);

    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined) {
          httpParams = httpParams.set(key, filters[key].toString());
        }
      });
    }

    return this.http.get<T[]>(`${this.baseUrl}${endpoint}`, { params: httpParams });
  }

  /**
   * Realiza una petición POST
   */
  post<T>(url: string, body: any, options: { headers?: HttpHeaders; params?: HttpParams } = {}): Observable<T> {
    // Esta línea garantiza que por defecto devuelva el body normal, no eventos
    return this.http.post<T>(`${this.baseUrl}${url}`, body, { observe: 'body', ...options });
  }

  /**
   * Realiza una petición PUT
   */
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data, { observe: 'body' });
  }

  /**
   * Realiza una petición PATCH
   */
  patch<T>(endpoint: string, data: any): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, data, { observe: 'body' });
  }

  /**
   * Realiza una petición DELETE
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, { observe: 'body' });
  }
}