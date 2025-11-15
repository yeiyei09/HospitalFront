import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'medico', 'enfermera', 'paciente'] },
  },
  {
    path: 'pacientes',
    loadComponent: () => import('./features/pacientes/pacientes-list.component').then(m => m.PacientesListComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'medico', 'enfermera'] },
  },
  {
    path: 'medicos',
    loadComponent: () => import('./features/medico/medico-list.component').then(m => m.MedicosListComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'citas',
    loadComponent: () => import('./features/citas/citas-list.component').then(m => m.CitasListComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'medico'] },
  },
  {
  path: 'enfermeras',
  loadComponent: () =>
    import('./features/enfermera/enfermera-list.component').then(m => m.EnfermeraListComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
  },
  {
  path: 'usuarios',
  loadComponent: () =>
    import('./features/usuario/usuario-list/usuario-list.component').then(m => m.UsuarioListComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  },
  



];
