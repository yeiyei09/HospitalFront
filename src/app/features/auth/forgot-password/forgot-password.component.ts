import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email = '';
  newPassword = '';
  verified = false; // Fase 1: verificar correo | Fase 2: restablecer contraseña

  loading = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  verifyEmail(): void {
    if (!this.email) {
      this.notificationService.showError('Por favor ingrese su correo electrónico.');
      return;
    }

    this.loading = true;
    this.authService.sendResetEmail(this.email).subscribe({
      next: (resp) => {
        this.loading = false;
        this.notificationService.showSuccess(
          'Se ha enviado un correo con el enlace para restablecer tu contraseña.'
        );
        // Si quieres, puedes redirigir al login automáticamente:
        // this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.loading = false;

        if (err.status === 404) {
          this.notificationService.showError('Correo no válido.');
        } else if (err.status === 403) {
          this.notificationService.showError('Correo no válido, comuníquese con el departamento de TI.');
        } else {
          this.notificationService.showError('Ocurrió un error al enviar el correo.');
      }
      }
    });
  }

  resetPassword(): void {
    if (!this.newPassword) {
      this.notificationService.showError('Debe ingresar una nueva contraseña.');
      return;
    }

    this.loading = true;
    this.authService.updatePassword(this.email, this.newPassword).subscribe({
      next: () => {
        this.loading = false;
        this.notificationService.showSuccess('Contraseña actualizada correctamente. Puedes iniciar sesión.');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 404) {
          this.notificationService.showError('Correo no válido.');
        } else if (err.status === 403) {
          this.notificationService.showError('Correo no válido, comuníquese con el departamento de TI.');
        } else {
          this.notificationService.showError('Error al actualizar la contraseña.');
        }
      }
    });
  }
}