import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  newPassword = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Extrae el token de la URL (ej. ?token=abcd123)
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      if (!this.token) {
        this.notificationService.showError('Token inválido o faltante.');
        this.router.navigate(['/auth/login']);
      }
    });
  }

  onSubmit(): void {
    if (!this.newPassword) {
      this.notificationService.showError('Debe ingresar una nueva contraseña.');
      return;
    }

    this.loading = true;

    this.authService.confirmPasswordReset(this.token, this.newPassword).subscribe({
      next: () => {
        this.loading = false;
        this.notificationService.showSuccess('Contraseña actualizada correctamente. Ahora puedes iniciar sesión.');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        if (err.status === 400) {
          this.notificationService.showError('El token no es válido o ha expirado.');
        } else {
          this.notificationService.showError('No se pudo actualizar la contraseña.');
        }
      }
    });
  }
}