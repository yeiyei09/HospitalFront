export interface Paciente {
  idPaciente?: string; // opcional, lo genera el backend
  nombrePaciente: string;
  correoPaciente: string;
  telefonoPaciente?: string;
  cedulaPaciente?: string;
  direccionPaciente?: string;
  fechaNacimiento?: string;
}