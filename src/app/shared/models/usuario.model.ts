// Usuario completo que viene del backend
export interface Usuario {
  id_usuario: string;
  username: string;
  email: string;
  nombre_completo: string;
  rol: string;
  activo: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

// Para registrar un nuevo usuario
export interface CreateUsuarioRequest {
  username: string;
  email: string;
  nombre_completo: string;
  rol: string;
  password: string;
}

// Para actualizar un usuario
export interface UpdateUsuarioRequest {
  username?: string;
  email?: string;
  nombre_completo?: string;
  rol?: string;
  activo?: boolean;
}

// Para cambiar contraseña
export interface ChangePasswordRequest {
  password: string;
}

// Filtros y paginación opcionales
export interface UsuarioFilters {
  username?: string;
  email?: string;
  nombre_completo?: string;
  rol?: string;
  activo?: boolean;
}