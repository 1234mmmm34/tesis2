import { Component, Injectable, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
//import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { BrowserModule } from '@angular/platform-browser';
import { DataService } from '../data.service'
import { AccesoPuertaService } from '../acceso-puerta/acceso-puerta.service';
//import * as moment from 'moment';
import { LoadingService } from '../loading-spinner/loading-spinner.service';
//import { PasarelaService } from '../paypal/paypal.service';
//import { paypal } from '../modelos/paypal';
import * as QRCode from 'qrcode';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { movimientos } from '../modelos/deudas';


@Component({
  selector: 'app-home-usuarios',
  templateUrl: './home-usuarios.component.html',
  styleUrls: ['./home-usuarios.component.css']
})
export class HomeUsuariosComponent {


 // @ViewChild('codigoQR') codigoQR!: ElementRef<HTMLImageElement>;

  movimientos: movimientos[] = [];
  total_deuda: number = 0;
 hikvision: string = this.dataservice.obtener_usuario(13);
 token:string='';
 enlaceConstruido:string ='';
 qrCodeDataUrl: string = '';


  constructor(private http: HttpClient, private dataservice: DataService, public userService:AccesoPuertaService, private loadingService: LoadingService,public accesoPuerta:AccesoPuertaService/*, private pasarelaService: PasarelaService*/) {

  }
  visible: boolean = false;
  nombre: any = this.dataservice.obtener_usuario(8);
  mes: any = "";
  isBlocked: boolean = false;

  ngOnInit(): void {

    this.consultarMovimientos();

    if(this.dataservice.obtener_usuario(15) == 'permitido'){
      this.isBlocked=false;
      this.ObtenerToken();
    }else{
      this.isBlocked=true;
      //this.mostrarMensajeBloqueo();
    }

    console.log("blocked: ", this.isBlocked)

    this.mes = this.dataservice.mesActual();
    this.consultarTotalDeuda(this.dataservice.obtener_usuario(1)); // Reemplaza 1 con el id_persona que necesites


  }


  consultarMovimientos(): void {


    this.dataservice.consultar_movimientos(this.dataservice.obtener_usuario(1)).subscribe(
      (data: movimientos[]) => {

        this.movimientos = data;

        console.log(this.movimientos)

      });



  }


  consultarTotalDeuda(id_persona: number): void {
    const apiUrl = `https://localhost:44397/api/Deudas/Consultar_TotalDeuda?id_persona=${id_persona}`;

    this.http.get<number>(apiUrl).subscribe(
      (resultado) => {
        this.total_deuda = Math.round(resultado * 100) / 100;
    //  this.total_deuda = this.decimalPipe.transform(resultado, '1.2-2');


      },
      (error) => {
        console.error('Error al consultar la deuda:', error);
      }
    );
  }

  copyLabelContent() {
    const label = document.getElementById('labelToCopy');
    if (label) {
      // Usa el contenido del label (esto incluye texto y cualquier otro contenido HTML)
      const textToCopy = label.innerText || ''; // Cambia a `innerHTML` si necesitas el HTML completo
      navigator.clipboard.writeText(textToCopy).then(() => {

        this.visible = true;
        console.log(this.visible)
        setTimeout(() => {
          this.visible = false;
        }, 3000);

      }).catch(err => {
        console.error('Error al copiar el texto: ', err);
      });
    } else {
      console.error('Elemento <label> no encontrado.');
    }
  }




  createPayment(price: number) {
    // URL base del servidor Node.js
    const baseUrl = 'http://localhost:3000';

    // Configuración de parámetros
    let params = new HttpParams().set('price', price.toString()).set('client_key', this.dataservice.obtener_usuario(13))
    .set('secret_key', this.dataservice.obtener_usuario(14));

    // Realizar la solicitud GET
    this.http.get<string>(`${baseUrl}/pay`, { params }).subscribe(
      (approvalUrl: string) => {
        console.log('Approval URL:', approvalUrl);
        // Redirige al usuario a la URL de aprobación de PayPal
        window.location.href = approvalUrl;
      },
      (error) => {
        console.error('Error creating PayPal payment:', error);
      }
    );
  }




  urlCodigoQR: string = '';
  userId: string ='';







  generarToken() {
    if(this.dataservice.obtener_usuario(15) != 'denegado'){



      this.accesoPuerta.generarToken(this.dataservice.obtener_usuario(1)).subscribe(
        (token: string) => {
          this.token=token;
          this.construirQr();
        },
        (error) => {

          console.error('Error al generar token', error);
        }
      );
    }
    else{
      Swal.fire({
        title: 'Acceso Restringido',
        text: 'No tienes permiso para acceder a esta página.',
        icon: 'error', // Icono de error
        confirmButtonText: 'Aceptar', // Texto del botón
        timer: 5000, // El mensaje se cerrará después de 5 segundos (opcional)
    });
    }


  }


  ObtenerToken():boolean{
    this.accesoPuerta.consultarToken(this.dataservice.obtener_usuario(1)).subscribe(
      (token: string) => {
        this.token=token;
        console.log("El token obtenido essssssssssssssss:", this.token);
        this.construirQr();
        return true;
      },
      (error) => {

        console.error('Error al obtener o no tenia ningun token generado', error);
        return false;
      }
    );
    return false;
  }


  construirQr(){
    this.enlaceConstruido=`https://localhost:44397/Student/PaseTemporal?token=${this.token}`;
    QRCode.toDataURL(this.enlaceConstruido, (err: any, url: string) => {
      if (err) {
        console.error('Error generando el QR:', err);
        return;
      }
      this.qrCodeDataUrl = url;
    });
  }

  descargarCodigoQR() {
    if(this.dataservice.obtener_usuario(15) == 'permitido'){
      this.isBlocked=false;
    }else{
      this.isBlocked=true;
      //this.mostrarMensajeBloqueo();
      return;
    }
    fetch(this.qrCodeDataUrl)
    .then(response => response.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'codigoQR.png';
      link.click();

      // Liberar la URL del objeto creado para evitar pérdida de memoria
      URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error('Error al descargar el código QR:', error);
    });
  }


  mostrarMensajeBloqueo() {
    if (this.isBlocked) {
        Swal.fire({
            icon: 'info',
            title: 'Sección bloqueada',
            text: 'Esta sección está temporalmente inhabilitada. Por favor, intenta más tarde.',
            showConfirmButton: true, // Mostrar botón de aceptar
            confirmButtonText: 'Aceptar', // Texto del botón
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false
        });
    }
}
}
