import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    roles?: string[];
}

export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'bi bi-speedometer2', class: '', roles: ['admin', 'medico', 'enfermera', 'paciente'] },
  { path: '/pacientes', title: 'Pacientes', icon: 'bi bi-people', class: '', roles: ['admin', 'medico', 'enfermera'] },
  { path: '/medicos', title: 'Médicos', icon: 'bi bi-person-badge', class: '', roles: ['admin'] },
  { path: '/citas', title: 'Citas', icon: 'bi bi-calendar-check', class: '', roles: ['admin', 'medico'] },
  { path: '/enfermeras', title: 'Enfermeras', icon: 'bi bi-heart-pulse', class: '', roles: ['admin'] },
];

@Component({
  selector: 'app-sidebar',
  standalone: true, // Indica que es un standalone component
  imports: [CommonModule, RouterLink, RouterLinkActive], // importamos las directivas necesarias
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  sidebarOpen = true;
  menuItems: RouteInfo[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.generarMenu();
  }

  generarMenu() {
  const role = this.authService.getUserRole();

  if (role) {
    this.menuItems = ROUTES.filter(route => route.roles?.includes(role) || false);
  } else {
    this.menuItems = [];
  }
}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']); // redirige automáticamente
  }
}