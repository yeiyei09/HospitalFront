import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
export class LoginComponent {
  loginData: LoginRequest = {
    username: '',
    password: ''
  };

  loading = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  onSubmit(): void {
    if (this.loading) return;

    if (!this.loginData.username || !this.loginData.password) {
      this.notificationService.showError('Debes ingresar usuario y contraseña.');
      return;
    }

    this.loading = true;
    console.log('LoginComponent: Enviando credenciales', this.loginData);

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        console.log('LoginComponent: Respuesta del backend:', response);
        this.authService.setUserData(response); // guarda token y usuario
        this.notificationService.showSuccess('Inicio de sesión exitoso');

        // Redirigir según el rol del usuario
        const user = response.user;
        const rol = user.rol?.toLowerCase();
        if (rol === 'admin' || rol === 'medico' || rol === 'enfermera' || rol === 'paciente') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/dashboard']);
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('Error durante el login:', error);

        if (error.status === 401 || error.status === 403) {
          this.notificationService.showError('Credenciales inválidas. Verifica tu usuario y contraseña.');
        } else {
          this.notificationService.showError('No se puede conectar con el servidor (http://localhost:8000).');
        }

        this.loading = false;
      }
    });
  }
}