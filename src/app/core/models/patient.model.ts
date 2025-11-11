export interface Patient {
  idPaciente: string;
  nombrePaciente: string;
  correoPaciente?: string;
  telefonoPaciente?: string;
  direccionPaciente?: string;
  fechaNacimiento?: string; // ISO string
}