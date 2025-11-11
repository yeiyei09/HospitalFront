import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, LoginRequest } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginData: LoginRequest = {
    nombre_usuario: '',
    contrasena: ''
  };
  
  loading = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // No redirigir automáticamente - dejar que el usuario vea el login
    // Si hay un token válido, el AuthGuard permitirá el acceso a rutas protegidas
    // Si el token es inválido, el AuthGuard redirigirá de vuelta al login
  }

  verificarBackend(): void {
    console.log('Verificando conectividad con el backend...');
    this.authService.verificarEstado().subscribe({
      next: (response) => {
        console.log('Backend conectado:', response);
      },
      error: (error) => {
        console.error('Error de conectividad con backend:', error);
        this.notificationService.showError('No se puede conectar con el servidor. Verifica que el backend esté ejecutándose en http://localhost:8000');
      }
    });
  }

  onSubmit(): void {
  if (this.loading) return;

  if (!this.loginData.nombre_usuario || !this.loginData.contrasena) {
    this.notificationService.showError('Debes ingresar usuario y contraseña.');
    return;
  }
  this.loginMock();

  this.loading = true;
  console.log('Intentando login con:', this.loginData);

  // Login demo solo si coincide con admin/admin123
  const isDemo = this.loginData.nombre_usuario === 'admin' && this.loginData.contrasena === 'admin123';
  if (isDemo && !navigator.onLine) {
    console.warn('⚠️ Sin conexión o sin backend, iniciando modo DEMO inmediato.');
    this.loginMock();
    return;
  }

  this.authService.login(this.loginData).subscribe({
    next: (response) => {
      console.log('Respuesta del login:', response);
      this.authService.setUserData(response);
      this.notificationService.showSuccess('Inicio de sesión exitoso');
      
      // Redirigir según rol
      if (response.nombre_usuario.es_admin) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/productos']);
      }
      this.loading = false;
    },
    error: (error) => {
      console.error('Error en login:', error);

      // Si el backend está caído y es el usuario demo, usar modo mock
      if ((error.status === 0 || error.status === undefined) && isDemo) {
        console.warn('Backend no disponible, usando login mock');
        this.loginMock();
      } else if (error.status === 401 || error.status === 403) {
        this.notificationService.showError('Credenciales inválidas.');
        this.loading = false;
      } else {
        this.notificationService.showError('No se puede conectar al servidor.');
        this.loading = false;
      }
    }
  });
}


  loginMock(): void {
    // Login mock para cuando el backend no está disponible
    console.warn('⚠️ Iniciando sesión en modo DEMO — los datos no son reales.');

    const mockResponse = {
      clave: 'mock_token_' + Date.now(),
      nombre_usuario: {
        id: '1',
        nombre: 'Administrador',
        nombre_usuario: 'admin',
        email: 'admin@itm.edu.co',
        telefono: '',
        activo: true,
        es_admin: true,
        fecha_creacion: new Date().toISOString(),
        fecha_edicion: new Date().toISOString()
      }
    };
    
    console.log('Usando login mock:', mockResponse);
    this.authService.setUserData(mockResponse);
    this.notificationService.showSuccess('Inicio de sesión exitoso (modo demo)');
    
    // Verificar que los datos se guardaron en localStorage
    console.log('Verificando localStorage después del login:');
    console.log('Token:', localStorage.getItem('auth_token'));
    console.log('Usuario:', localStorage.getItem('user_data'));
    console.log('Rol:', localStorage.getItem('user_role'));
    
    this.router.navigate(['/dashboard']);
    this.loading = false;
  }

}
