import { Component, Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Router } from '@angular/router';
import {  controladores, controlador, fraccionamientos, fraccionamiento } from "../modelos/fraccionamientos"
import { usuario, usuarios } from "../modelos/usuarios"
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as $ from "jquery";
import Swal from 'sweetalert2'
import { Personas } from '../cuenta/personas.model';
import { v4 as uuidv4 } from 'uuid';
import { InvitacionService } from '../propiedades/invitacion.service';
import { CorreoService } from '../propiedades/correo.service';


@Component({
  selector: 'app-tesorero',
  templateUrl: './tesorero.component.html',
  styleUrls: ['./tesorero.component.css']
})
export class TesoreroComponent {

//persona = new persona();
personas: Personas[] = [];

  httpclient: any;
  UserGroup: FormGroup;
  controladores: controladores[] = [];
  controlador =new controlador();
  fraccionamientos: fraccionamientos[] = [];
  fraccionamiento =new fraccionamiento();


title = 'AngularHttpRequest';
row: any;
home: any;
id_fracc: any;
cont: any;


constructor(private http: HttpClient, private dataService: DataService, private fb: FormBuilder,private invitacionService: InvitacionService, private correoService: CorreoService){


this.UserGroup = this.fb.group({
     correo: ['', Validators.required]

   })
}



ngOnInit(): void {

  this.consultarCorreo();

  $(function myFunction() {
    console.log("si entra")
    var x = <HTMLVideoElement>document.getElementById("informacion");
    var y = <HTMLVideoElement>document.getElementById("controlador");
    if (x.style.display === "block") {
        x.style.display = "none";
        y.style.display = "block";
    } else {
        x.style.display = "block";
        y.style.display = "none";
    }
  });
}

consultarCorreo() {
  this.dataService.consultarCorreo(this.dataService.obtener_usuario(6)).subscribe((personas: Personas[]) => {
    //console.log(controladores);
    this.correo_invitado1 = this.personas[0].correo;
  });
}

onRowClicked(fraccionamiento: any){
  this.id_fracc = fraccionamiento['id_fraccionamiento'];
}

edit(controladores: {
  user: any;
  password: any;
  ip: any;
  port: any;
}){
  this.controlador.user= controladores.user;
  this.controlador.password= controladores.password;
  this.controlador.ip= controladores.ip;
  this.controlador.port= controladores.port;


}





correo_invitado1="";
//correo_invitado="";


async agregar_usuario() {

  console.log("correo: ",this.correo_invitado1)

    const params = {
      nombre: "Correo enviado",
      apellido_pat: "n",
      apellido_mat: "n",
      tipo_usuario: "tesorero",
      telefono: "n",
      fecha_nacimiento: new Date(),
      correo: this.correo_invitado1,
      contrasenia: "n",
      id_fraccionamiento: this.dataService.obtener_usuario(1),
      id_administrador: this.dataService.obtener_usuario(1),
      id_lote: 1,
      hikvision: "permitido"

    };

   // this.correo_invitado=this.correo_invitado1;
   console.log("PARAMSS: ",params)

   console.log("generarinvitacion");
   const token = uuidv4();
   console.log(token, this.correo_invitado1, this.dataService.obtener_usuario(1), this.dataService.obtener_usuario(5), this.dataService.obtener_usuario(2), "tesorero")

   var correo = this.correo_invitado1;
   this.invitacionService.generarInvitacion(token, this.correo_invitado1, this.dataService.obtener_usuario(1), this.dataService.obtener_usuario(5), this.dataService.obtener_usuario(2), "tesorero")
     .subscribe(
       response => {
         console.log('Success:', response);
         this.correoService.Enviar_Correo( this.correo_invitado1, "haz sido invitado por tu administrador para unirte a una comunidad en linea\n por favor termina tu registro en el siguiente link: \n http://159.54.141.160:4200/Invitacion?token=" + token);
        // this.enviarCorreo(correoElectronico, "haz sido invitado por tu administrador para unirte a una comunidad en linea\n por favor termina tu registro en el siguiente link: \n http://159.54.141.160:4200/Invitacion?token=" + token);

       },
       error => {
         console.error('Error al generar la invitación:', error);

       }
     );





    console.log("PARAMSS: ",params)
    let direccion = "http://159.54.141.160/api/Usuarios/Agregar_Usuario";

    const headers = new HttpHeaders({ 'myHeader': 'procademy' });
    this.http.post(
      direccion,
      params, { headers: headers })
      .subscribe((res) => {


        Swal.fire({
          title: 'Invitación enviada correctamente',
          text: '',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        })





        $(function myFunction() {
          console.log("si entra")

          var x = <HTMLVideoElement>document.getElementById("informacion");
          var y = <HTMLVideoElement>document.getElementById("controlador");
          if (x.style.display === "block") {

              x.style.display = "none";
              y.style.display = "block";
          } else {
              x.style.display = "block";
              y.style.display = "none";
          }
        });



        //this.UserGroup.reset();

      },
      (error)=>{
        Swal.fire({
          title: 'Agrega un correo valido',
          text: '',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        })
      });

}
}
