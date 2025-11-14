import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] as UserRole[]; // roles permitidos para la ruta
    const userRole = this.authService.getUserRole();

    // ❌ Si no hay token o usuario
    if (!userRole) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    // 🟢 Si el rol del usuario está dentro de los permitidos, dejamos pasar
    if (expectedRoles.includes(userRole)) {
      return true;
    }

    // 🚫 Si el rol no tiene permiso, redirigimos al dashboard o una página de error
    this.router.navigate(['/dashboard']);
    return false;
  }
}