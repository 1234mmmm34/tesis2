import { Component } from '@angular/core';
import { Personas } from './personas.model'; 
import { DataService } from '../data.service';
import { PersonasService } from './personas.service';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { Notificaciones } from './notificaciones.model';
import { usuario, usuarios } from "../modelos/usuarios";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent {

  UserGroup: FormGroup;
  tipo: any;
  constructor(private personasService: PersonasService, private NotificacionesService:NotificacionesService,
    private notificacionesService:NotificacionesService, private fb: FormBuilder, private dataService: DataService ) { 
      this.UserGroup = this.fb.group({
        //   id_fraccionamiento: ['16', Validators.required],
           mensaje: ['', Validators.required],
           asunto: [' ', Validators.required],
           destinatario: ['', Validators.required],
           tipo: ['', Validators.required],

      
      
         })
    }
  personas: Personas[] = [];

  id_fraccionamineto: number=this.dataService.obtener_usuario(1);
  respuestaNotificacion: string | null = null;
  idNotificacion: number | undefined;
  notificaciones: Notificaciones[] = [];
  tipoSeleccionado: string = 'General';
  idFraccionamiento: number = 0;
  idUsuario: number = 0;
  filtroNotificaciones: "" | undefined;
  usuarios: usuarios[] = [];

  

  ngOnInit(): void {
    this.consultarPersonas(this.id_fraccionamineto);
  }


  eliminarNotificacionPorId(): void {
    if (this.idNotificacion !== undefined) {
      this.NotificacionesService.eliminarNotificacion(this.idNotificacion, this.id_fraccionamineto ) // Agrega el id_fraccionamiento si es necesario
        .subscribe(
          (respuesta: string) => {
            this.respuestaNotificacion =respuesta;
            console.log('Respuesta al eliminar notificación:', respuesta);
            // Manejar la respuesta del servidor
          },
          (error) => {
            this.respuestaNotificacion =error;
            console.error('Error al eliminar notificación:', error);
            // Manejo de errores
          }
        );
    } else {
      this.respuestaNotificacion ='El ID de notificación es inválido';
      console.error('El ID de notificación es inválido');
    }
  }

  consultarNotificacionPorId(idFraccionamiento: number, idDestinatario: number): void {
    this.NotificacionesService.consultarNotificacionPorId(idFraccionamiento, idDestinatario)
      .subscribe(
        (notificaciones: Notificaciones[]) => {
          console.log('Notificaciones consultadas:', notificaciones);
          // Aquí puedes manejar las notificaciones devueltas por la API
        },
        (error) => {
          console.error('Error al consultar notificación:', error);
          // Manejo de errores
        }
      );
  }

  agregarNotificacion(formulario: any): void {
   //const idFraccionamiento = parseInt(formulario.fraccionamiento);
   const idFraccionamiento = this.id_fraccionamineto;
   //console.log(idFraccionamiento);
   const tipo = formulario.tipo;
   console.log("tipo"+  tipo);
   let destinatarioId=0;
   if(tipo=='general'){
   destinatarioId=0;
   }else if(tipo=='individual'){
     destinatarioId = parseInt(formulario.destinatario.split(' - ')[0]);
   }else{
     return;
   }
   //console.log(destinatarioId);
   const asunto = formulario.asunto;
   //console.log(asunto); 
   const mensaje = formulario.mensaje;
   //console.log(mensaje);

   this.NotificacionesService.agregarNotificacion(idFraccionamiento, tipo, destinatarioId, asunto, mensaje)
     .subscribe(
       (respuesta: string) => {
         this.respuestaNotificacion =respuesta;
         console.log('Respuesta:', respuesta);
         Swal.fire({
           title: 'Notificacion agregada correctamente',
           text: '',
           icon: 'success',
           confirmButtonText: 'Aceptar'
         });
         this.actualizarNotificaciones();
       },
       (error) => {
         console.error('Error al agregar notificación Angular:', error);
         Swal.fire({
           title: 'Error al agregar notificación',
           text: '',
           icon: 'error',
           confirmButtonText: 'Aceptar'
         });
       
       }
     );
  }

  consultarPersonas(idFraccionamiento: number): void {
    this.personasService.consultarPersonasPorFraccionamiento(idFraccionamiento).subscribe(
      (personas: Personas[]) => {
       this.personas = personas;
        console.log('Personas:', personas);
      },
      (error) => {
        // Manejo de errores
        console.error('Error:', error);
      }
    );
  }


  


 


  actualizarNotificaciones(): void {
    this.notificaciones = []; // Vaciar el arreglo antes de cargar nuevas notificaciones

    if (this.tipoSeleccionado === 'General') {
      this.idUsuario = 0;
    } else {
      // Asignar el ID de usuario correspondiente a la sesión (puedes ajustarlo según tu lógica de inicio de sesión)
      // this.idUsuario = ...;
      this.idUsuario = 1;
    } 

    this.notificacionesService.consultarNotificacionesPorId(this.idFraccionamiento, this.idUsuario)
      .subscribe(
        (notificaciones: Notificaciones[]) => {
          console.log(notificaciones);
          this.notificaciones = notificaciones;
        },
        (error) => {
          console.error('Error al obtener las notificaciones:', error);
          // Manejo de errores
        }
      );
  }

  filtrarPorTipo(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.tipoSeleccionado = target.value;
    this.actualizarNotificaciones();
  }
}
