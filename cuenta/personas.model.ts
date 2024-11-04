export class Personas {
    id_persona: number;
  nombre: string;
  apellido_pat: string;
  apellido_mat: string;
  telefono: string;
  tipo_usuario: string;
  id_fraccionamiento: number;
  id_lote: number;
  intercomunicador: string;
  codigo_acceso: string;
  correo: string;
  fecha_nacimiento:string;
  contrasenia:string;

  constructor(
    id_persona: number,
    nombre: string,
    apellido_pat: string,
    apellido_mat: string,
    telefono: string,
    tipo_usuario: string,
    id_fraccionamiento: number,
    id_lote: number,
    intercomunicador: string,
    codigo_acceso: string,
    correo: string,
    fecha_nacimiento:string,
    contrasenia:string
  ) {
    this.id_persona = id_persona;
    this.nombre = nombre;
    this.apellido_pat = apellido_pat;
    this.apellido_mat = apellido_mat;
    this.telefono = telefono;
    this.tipo_usuario = tipo_usuario;
    this.id_fraccionamiento = id_fraccionamiento;
    this.id_lote = id_lote;
    this.intercomunicador = intercomunicador;
    this.codigo_acceso = codigo_acceso;
    this.correo = correo;
    this.fecha_nacimiento=fecha_nacimiento,
    this.contrasenia=contrasenia
  }
}

