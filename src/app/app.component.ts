import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] // ✅ corregido (antes tenía styleUrl)
})
export class AppComponent implements OnInit {
  title = 'frontend-angular-clean-architecture';
  showSidebar = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // 1️⃣ Escuchar cambios de ruta para mostrar/ocultar Sidebar según la URL
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const enRutaAuth = event.url.startsWith('/auth');
        const estaAutenticado = this.authService.isAuthenticated();

        // Solo mostramos el sidebar si NO está en rutas de auth y HAY sesión activa
        this.showSidebar = !enRutaAuth && estaAutenticado;
      });

    // 2️⃣ Verificar las condiciones iniciales al cargar la app
    const rutaActual = this.router.url;
    const enRutaAuthInicial = rutaActual.startsWith('/auth');
    const estaAutenticadoInicial = this.authService.isAuthenticated();
    this.showSidebar = !enRutaAuthInicial && estaAutenticadoInicial;

    // 3️⃣ Escuchar cambios en currentUser$ (login/logout) para actualizar en vivo
    this.authService.currentUser$.subscribe(user => {
      const rutaActual = this.router.url;
      const enRutaAuth = rutaActual.startsWith('/auth');
      this.showSidebar = !enRutaAuth && !!user;
    });
  }
}