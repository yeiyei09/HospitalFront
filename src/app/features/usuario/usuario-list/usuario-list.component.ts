import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';
import {
  Usuario,
  CreateUsuarioRequest,
  UpdateUsuarioRequest,
  UsuarioFilters,
} from '../../../shared/models/usuario.model';
import { PaginationParams } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.scss'],
})
export class UsuarioListComponent implements OnInit {
  usuarios: Usuario[] = [];
  filters: UsuarioFilters = {};
  usuarioForm!: FormGroup;

  showModal = false;
  editingUsuario: boolean = false;
  selectedUsuario: Usuario | null = null;

  loading = false;
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  constructor(private usuarioService: UsuarioService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUsuarios();
  }

  /** Inicializa el formulario reactivo */
  private initForm() {
    this.usuarioForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      nombre_completo: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      rol: ['usuario', Validators.required],
      password: [''], // requerido solo al crear
    });
  }

  /** Cargar usuarios con paginación y filtros */
  loadUsuarios(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.itemsPerPage,
    };

    this.usuarioService.getUsuarios(pagination, this.filters).subscribe({
      next: (data) => {
        this.usuarios = data;
        this.loading = false;

        // Si tu API devuelve total o algo similar, puedes ajustar aquí:
        this.totalPages =
          data && data.length === this.itemsPerPage
            ? this.currentPage + 1
            : this.currentPage;
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
        this.loading = false;
      },
    });
  }

  /** Filtros dinámicos */
  onFilterChange(): void {
    this.currentPage = 1;
    this.loadUsuarios();
  }

  clearFilters(): void {
    this.filters = {};
    this.loadUsuarios();
  }

  /** Abrir modal para crear usuario */
  openCreateModal(): void {
    this.editingUsuario = false;
    this.usuarioForm.reset({
      rol: 'usuario',
    });
    this.showModal = true;
  }

  /** Abrir modal para editar usuario existente */
  editUsuario(usuario: Usuario): void {
    this.editingUsuario = true;
    this.selectedUsuario = usuario;
    this.usuarioForm.patchValue({
      username: usuario.username,
      nombre_completo: usuario.nombre_completo,
      email: usuario.email,
      rol: usuario.rol,
    });
    this.showModal = true;
  }

  /** Cierra el modal */
  closeModal(): void {
    this.showModal = false;
    this.usuarioForm.reset();
    this.selectedUsuario = null;
  }

  /** Guardar usuario (crear o actualizar) */
  saveUsuario(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    const formValue = this.usuarioForm.value;

    if (this.editingUsuario && this.selectedUsuario) {
      const updateData: UpdateUsuarioRequest = {
        username: formValue.username,
        email: formValue.email,
        nombre_completo: formValue.nombre_completo,
        rol: formValue.rol,
      };

      this.usuarioService
        .updateUsuario(this.selectedUsuario.id_usuario, updateData)
        .subscribe({
          next: () => {
            this.loadUsuarios();
            this.closeModal();
          },
          error: (err) => console.error('Error al actualizar usuario', err),
        });
    } else {
      const newUser: CreateUsuarioRequest = {
        username: formValue.username,
        email: formValue.email,
        nombre_completo: formValue.nombre_completo,
        rol: formValue.rol,
        password: formValue.password,
      };

      this.usuarioService.createUsuario(newUser).subscribe({
        next: () => {
          this.loadUsuarios();
          this.closeModal();
        },
        error: (err) => console.error('Error al crear usuario', err),
      });
    }
  }

  /** Eliminar usuario */
  deleteUsuario(usuario: Usuario): void {
    if (confirm(`¿Seguro que deseas eliminar a ${usuario.username}?`)) {
      this.usuarioService.deleteUsuario(usuario.id_usuario).subscribe({
        next: () => this.loadUsuarios(),
        error: (err) => console.error('Error al eliminar usuario', err),
      });
    }
  }

  /** Paginación */
  goToPage(page: number): void {
    if (page <= 0 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadUsuarios();
  }
}