export class Notificaciones {
    id_notificacion: number;
  id_fraccionamiento: number;
  tipo: string;
  id_destinatario: number;
  asunto: string;
  mensaje: string;

  constructor(
    id_notificacion: number,
    id_fraccionamiento: number,
    tipo: string,
    id_destinatario: number,
    asunto: string,
    mensaje: string
  ) {
    this.id_notificacion = id_notificacion;
    this.id_fraccionamiento = id_fraccionamiento;
    this.tipo = tipo;
    this.id_destinatario = id_destinatario;
    this.asunto = asunto;
    this.mensaje = mensaje;
  }
}
