import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const token = this.authService.getToken();

    if (!token) {
      console.warn('AuthGuard: No hay token — redirigiendo al login.');
      this.authService.logout();
      return this.router.parseUrl('/auth/login');
    }

    // Verificar si el token ha expirado
    if (this.authService.isTokenExpired()) {
      console.warn('AuthGuard: Token expirado — cerrando sesión y redirigiendo al login.');
      this.authService.logout();
      return this.router.parseUrl('/auth/login');
    }

    // Si todo está correcto, permitir acceso
    return true;
  }
}