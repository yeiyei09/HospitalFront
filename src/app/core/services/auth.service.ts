import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../../shared/models/usuario.model';
import { ApiService } from './api.service';
import { HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

export interface LoginRequest {
  username: string;   // coincide con FastAPI (OAuth2PasswordRequestForm)
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: Usuario;
}

export type UserRole = 'admin' | 'medico' | 'enfermera' | 'paciente' | 'usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';
  private readonly ROLE_KEY = 'user_role';

  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadUserFromStorage();
  }

  /**
   * Inicia sesión en el backend (FastAPI)
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
  console.log('AuthService: Intentando login con credenciales:', credentials);

  const body = new URLSearchParams();
  body.set('username', credentials.username);
  body.set('password', credentials.password);

  // ✅ Formato correcto de encabezado
  const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

  return this.apiService.post<LoginResponse>(
    '/auth/login',
    body.toString(),
    { headers }
  );
}

  /**
   * Cierra sesión del usuario
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    this.currentUserSubject.next(null);
    console.log('AuthService: sesión cerrada');
  }

  /**
   * Obtiene el token JWT almacenado
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  /**
   * Guarda el token y usuario tras login
   */
  setUserData(loginResponse: LoginResponse): void {
    console.log('AuthService: guardando datos del usuario:', loginResponse);

    localStorage.setItem(this.TOKEN_KEY, loginResponse.access_token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(loginResponse.user));
    localStorage.setItem(this.ROLE_KEY, loginResponse.user.rol); // ✅ el 'rol' viene del backend

    this.currentUserSubject.next(loginResponse.user);

    console.log('AuthService: datos guardados en localStorage');
    console.log('Token:', localStorage.getItem(this.TOKEN_KEY));
    console.log('Usuario:', localStorage.getItem(this.USER_KEY));
  }

  /**
   * Carga los datos de usuario si existen en localStorage
   */
  private loadUserFromStorage(): void {
    const userData = localStorage.getItem(this.USER_KEY);
    if (userData) {
      try {
        const user: Usuario = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('AuthService: error al cargar usuario desde localStorage', error);
        this.logout();
      }
    }
  }

  /**
   * Devuelve el rol actual del usuario
   */
  getUserRole(): UserRole | null {
    const user = this.getCurrentUser();
    return (user?.rol as UserRole) ?? null;
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  hasRole(role: UserRole): boolean {
    return this.getUserRole() === role;
  }

  /**
   * Comprueba si puede acceder a una sección dada
   */
  canAccess(route: string): boolean {
    const role = this.getUserRole();
    if (!role) return false;

    // Roles y accesos podrían ajustarse según tus vistas
    const accessRules: { [key in UserRole]?: string[] } = {
      admin: ['dashboard', 'pacientes', 'medicos', 'citas', 'enfermeras'],
      medico: ['dashboard', 'pacientes', 'citas'],
      enfermera: ['dashboard', 'pacientes'],
      paciente: ['dashboard'],
    };

    return accessRules[role]?.includes(route) ?? false;
  }

  /**
 * Verifica si el token JWT ha expirado
 */
isTokenExpired(): boolean {
  const token = this.getToken();
  if (!token) return true;

  try {
    const decoded: any = jwtDecode(token);
    if (!decoded.exp) return true;

    // 'exp' está en segundos; convertimos a milisegundos
    const expirationDate = new Date(decoded.exp * 1000);
    const now = new Date();

    return expirationDate <= now;
  } catch (error) {
    console.error('AuthService: Error al decodificar el token', error);
    return true;
  }
}

    /**
  * Verifica si el correo pertenece a un paciente y existe
 */
  sendResetEmail(email: string) {
  return this.apiService.post('/auth/request-password-reset', { email });
  }

  /**
  * Cambia la contraseña del usuario
  */
  updatePassword(email: string, newPassword: string): Observable<any> {
    return this.apiService.post('/auth/reset-password', { email, new_password: newPassword });
  }
  confirmPasswordReset(token: string, newPassword: string) {
  return this.apiService.post('/auth/confirm-password-reset', {
    token,
    new_password: newPassword
  });
}
}

