import { Component, inject } from '@angular/core';
import { Deudores } from '../ingresos-extraordinarios/deudores.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DataService } from '../data.service';
import { FormBuilder } from '@angular/forms';
import { PersonasService } from '../ingresos-extraordinarios/personas.service';
import { deudores, deudor,deuda,deuda_enviada } from "../modelos/deudas"
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import { LoadingService } from '../loading-spinner/loading-spinner.service';
import { getDownloadURL, ref, Storage, uploadBytesResumable } from '@angular/fire/storage';
import { DeudaService } from '../ingresos-extraordinarios/deuda.service';

@Component({
  selector: 'app-mis-deudas',
  templateUrl: './mis-deudas.component.html',
  styleUrls: ['../consulta.css']
})
export class MisDeudasComponent {

  httpclient: any;
  deudores: deudores[] = [];
  deudor = new deudor();
  filtroDeudores: '' | undefined;
  filtroFecha: '' | undefined;
  indice: number = 0;
  cont: number = 1;
  verdaderoRango: number = 6;

  Deudores_totales: Deudores[] = [];
  Deudores_totales2: Deudores[] = [];
  deuda = new deuda_enviada();
  mostrarGrid: boolean = false;
  selectedValue: any;
  total: number = 0;
  total_pago: number = 0;
  producto: string = '';


  ngOnInit() {
    //this.fetchDataDeudores();
    this.selectedValue = "1";
    this.ConsultarDeudasPagadas();
  }

  constructor(private http: HttpClient, private deudaService: DeudaService, private dataService: DataService, private fb: FormBuilder, private personasService: PersonasService, private loadingService: LoadingService) { }

  // fetchDataDeudores() {
  //   this.dataService.fetchDataDeudores(this.dataService.obtener_usuario(3)).subscribe((deudores: deudores[]) => {
  //     console.log(deudores);
  //     this.deudores = deudores;
  //   });
  // }


  pageChanged(event: any) {
    // Determinar la acción del paginator
    if (event.previousPageIndex < event.pageIndex) {
      // Se avanzó a la siguiente página
      this.paginador_adelante();
    } else if (event.previousPageIndex > event.pageIndex) {
      // Se retrocedió a la página anterior
      this.paginador_atras();
    }
  }

  edit(deudas: any) {
    this.deuda.id_deuda = deudas.id_deuda;
    this.deuda.comprobante = deudas.comprobante;
    this.deuda.monto = deudas.monto;
    this.deuda.id_fraccionamiento = deudas.id_fraccionamiento;
    this.deuda.estado = deudas.estado;
    this.deuda.fecha = deudas.fecha;
    this.deuda.subdeuda = deudas.subdeuda;
    this.deuda.id_deudor = deudas.id_deudor;
    this.deuda.recargo = deudas.recargo;

  }


  async enviar_deuda(montoDeudaExtra: any) {

    await this.guardarImagenFirebase();

    const params = {
      monto: this.deuda.monto,
      comprobante: this.urlComprobante,
      id_fraccionamiento: this.deuda.id_fraccionamiento,
      estado: 0,
      fecha: "2024-11-06T00:20:57.334Z",
      subdeuda: this.deuda.subdeuda,
      id_deudor: this.deuda.id_deudor,
      id_deuda: this.deuda.id_deuda,
      recargo: this.deuda.recargo

    };



    console.log("deudas: ", params)

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    console.log("actualizar: ", params)

    return this.http.post("https://localhost:44397/api/Deudas/InsertarDeudaEnviada", params).subscribe(
      (_response) => {
        console.log("actualiza", params)
        Swal.fire({
          icon: 'info',
          title: 'Pago pendiente de revisión',
          text: 'El pago ha sido recibido y está pendiente de revisión.',
          confirmButtonText: 'Aceptar'
        });

      }
    )

  }





  pagar(deudor: any){
    this.producto = deudor.nombre_deuda;


    if (this.calcularDiasRetraso(deudor.proximo_pago, deudor.periodicidad) != 0) {
      this.total_pago = deudor.monto_restante + deudor.recargo;
    }
    else {
      this.total_pago = deudor.monto_restante;


    }

}


createPayment() {
  // URL base del servidor Node.js
  const baseUrl = 'http://localhost:3000';

   console.log("t: ",this.total_pago)

  // Configuración de parámetros
  let params = new HttpParams().set('price', (this.total_pago).toString()).set('client_key', this.dataService.obtener_usuario(13))
    .set('secret_key', this.dataService.obtener_usuario(14)).set('product',  this.producto ).set('id_deuda', "13").set('url', "http://localhost:4200/Student/PanelUser/MisDeudas");

  // Realizar la solicitud GET

  this.http.get<string>(`${baseUrl}/pay`, { params }).subscribe(
    (approvalUrl: string) => {

     window.open(approvalUrl, '_blank');

      this.total_pago = 0;
      this.producto = '';
    },
    (error) => {
      console.error('Error creating PayPal payment:', error);
    }
  );


}



  paginador_atras() {

    if (this.indice - this.verdaderoRango >= 0) {
      this.Deudores_totales2 = this.Deudores_totales.slice(this.indice - this.verdaderoRango, this.indice);
      this.indice = this.indice - this.verdaderoRango;
      this.cont--;
    }

  }

  paginador_adelante() {
    if (this.Deudores_totales.length - (this.indice + this.verdaderoRango) > 0) {
      this.indice = this.indice + this.verdaderoRango;
      this.Deudores_totales2 = this.Deudores_totales.slice(this.indice, this.indice + this.verdaderoRango);
      this.cont++;

    }
  }

  onChange(event: any) {

    this.selectedValue = event.target.value;

    if (this.selectedValue == "1") {
      this.ConsultarDeudasPagadas();
    }
    else if(this.selectedValue == "2"){
      this.ConsultarDeudores();
    }
    else{
      this.ConsultarSolicitudes();
    }
    //this.id_destinatario = selectedValue;
    // console.log(this.id_destinatario);

  }


  ConsultarDeudores() {

    this.loadingService.show();
    this.personasService.consultarDeudores(this.dataService.obtener_usuario(3), this.dataService.obtener_usuario(1)).subscribe(
      (deudasUsuario: Deudores[]) => {
        this.loadingService.hide();
        this.mostrarGrid = true;

        console.log(deudasUsuario)

        this.Deudores_totales = deudasUsuario
        this.indice = 0;
        this.cont = 1;
        this.verdaderoRango = 6;
        this.Deudores_totales2 = this.Deudores_totales.slice(this.indice, this.indice + this.verdaderoRango);

        if (this.Deudores_totales.length == 0) {
          Swal.fire({
            title: 'El usuario seleccionado no tiene deudas atrasadas',
            text: '',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
          });
        }
      },
      (error) => {
        // Manejo de errores
        console.error('Error:', error);
      }
    );
  }


  ConsultarSolicitudes() {
    this.loadingService.show();
    this.personasService.Consultar_Solicitudes(this.dataService.obtener_usuario(3), this.dataService.obtener_usuario(1)).subscribe(
      (deudasUsuario: Deudores[]) => {
        this.loadingService.hide();
        this.mostrarGrid = true;

        this.Deudores_totales = deudasUsuario
        this.indice = 0;
        this.cont = 1;
        this.verdaderoRango = 6;
        this.Deudores_totales2 = this.Deudores_totales.slice(this.indice, this.indice + this.verdaderoRango);

        if (this.Deudores_totales.length == 0) {
          Swal.fire({
            title: 'no tiene solicitudes pendientes',
            text: '',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
          });
        }
      },
      (error) => {
        // Manejo de errores
        console.error('Error:', error);
      }
    );
  }


  ConsultarDeudasPagadas() {
    this.loadingService.show();
    this.personasService.Consultar_DeudasPagadas(this.dataService.obtener_usuario(3), this.dataService.obtener_usuario(1)).subscribe(
      (deudasUsuario: Deudores[]) => {
        this.loadingService.hide();
        this.mostrarGrid = true;

        this.Deudores_totales = deudasUsuario
        this.indice = 0;
        this.cont = 1;
        this.verdaderoRango = 6;
        this.Deudores_totales2 = this.Deudores_totales.slice(this.indice, this.indice + this.verdaderoRango);

        if (this.Deudores_totales.length == 0) {
          Swal.fire({
            title: 'El usuario seleccionado no tiene historial de deudas pagadas',
            text: '',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
          });
        }
      },
      (error) => {
        // Manejo de errores
        console.error('Error:', error);
      }
    );
  }

  calcularDiasRetraso(proximoPago: string, periodicidad: number): number {

    const fechaProximoPago = new Date(proximoPago);
    const hoy = new Date();
    const diferenciaTiempo = hoy.getTime() - fechaProximoPago.getTime();
    const diasRetraso = Math.floor(diferenciaTiempo / (1000 * 3600 * 24)); // Calcula los días de diferencia

    // Sumar la periodicidad en días


    return Math.max(0, diasRetraso); // Devuelve al menos cero si la fecha ya ha pasado
  }


  calcularTotal(retraso: number, monto: number, recargo: number): number {


    if (retraso != 0) {
      this.total = monto + recargo;
    }
    else {
      this.total = monto;


    }
    return isNaN(this.total) ? 0 : parseFloat(this.total.toFixed(2));
  }


  formatearFecha(fechaPago: string) {
    return fechaPago = formatDate(fechaPago, 'yyyy-MM-dd', 'en-US');
  }



/*

  async pagarDeudaExtraordinaria(montoDeudaExtra: any) {

    this.tipo_pago = "pagado";

    if (montoDeudaExtra < this.total) {
      this.tipo_pago = "abono";
      //  montoDeudaExtra = this.monto_restante - montoDeudaExtra;
    }

    if (this.archivoSeleccionado) {
    try {

      await this.guardarImagenFirebase();


        this.deudaService.pagarDeudaExtraordinaria(this.recargo, this.id_deudor, this.id_deuda, this.dataService.obtener_usuario(3), this.fechaProximoPago, this.urlComprobante , "solicitud", this.total, montoDeudaExtra, this.subdeuda).subscribe(
          (respuesta) => {
            if (respuesta) {
              Swal.fire({
                title: 'La deuda ha sido pagada exitosamente',
                text: '',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
              console.log('La deuda ha sido pagada exitosamente');
              this.onChangeUsuario({ target: { selectedIndex: 0 } });
              this.consultarHistorialDeudas(this.dataService.obtener_usuario(3));
            } else {
              console.log('Hubo un problema al pagar la deuda');
              Swal.fire({
                title: 'Hubo un problema al pagar la deuda',
                text: '',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
          },
          (error) => {
            console.error('Error al intentar pagar la deuda:', error);
            Swal.fire({
              title: 'Hubo un problema al pagar la deuda',
              text: 'Por favor contáctese con el administrador de la página',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        );
      } catch (error) {
        console.error('Error al guardar la imagen en Firebase:', error);
        Swal.fire({
          title: 'Hubo un problema al subir el comprobante',
          text: 'Por favor intente de nuevo',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    } else {
      Swal.fire({
        title: 'Por favor cargue un comprobante de pago',
        text: '',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  }

*/








  imagenSeleccionada: any; // Variable para mostrar la imagen seleccionada en la interfaz
  archivoSeleccionado: File | null = null;
  imagenEnBytes: Uint8Array | null = null;


  handleInputFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagenSeleccionada = reader.result as string;
          this.archivoSeleccionado = file; // Guardar el archivo seleccionado
          Swal.fire({
            title: 'Comprobante cargado correctamente',
            text: '',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });

        };
        reader.readAsDataURL(file);
      }
    }
    input.value = ''; // Limpiar el input de tipo file
  }


  private storage: Storage = inject(Storage);
  urlComprobante: string = '';


  guardarImagenFirebase(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.archivoSeleccionado != null) {
        const filepath = `Comprobantes/${this.archivoSeleccionado.name}`;
        const fileRef = ref(this.storage, filepath);
        const uploadFile = uploadBytesResumable(fileRef, this.archivoSeleccionado);
        uploadFile.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Progreso de la carga a Firebase: ', progress);
          },
          (error) => {
            console.log('Error al cargar el archivo a Firebase: ', error);
            reject(error); // Rechaza la promesa
          },
          async () => {
            console.log('El archivo se guardó con éxito en Firebase');
            const url = await getDownloadURL(fileRef);
            this.urlComprobante = url;
            console.log('URL del archivo subido: ', url);
            resolve(); // Resuelve la promesa
          }
        );
        console.log(this.archivoSeleccionado.name);
      } else {
        reject(new Error('No se ha seleccionado ningún archivo'));
      }
    });
  }




}
