import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccesoPuertaService {

  constructor(private http: HttpClient) {}

  //https://localhost:44397/Usuarios/Generar_Token
  //https://localhost:44397/Usuarios/Consultar_Correo?id_persona=${userId}

  apiUrl:string ='https://localhost:44397/api/Whatsapp/';
  generarToken(idUsuario: number): Observable<string> {
    const url = `${this.apiUrl}Generar_Token?idUsuario=${idUsuario}`;

    return this.http.get(url, { responseType: 'text' });
  }

  consultarToken(idUsuario: number): Observable<string> {
    const url = `${this.apiUrl}Consultar_Token_Activo?idUsuario=${idUsuario}`;

    return this.http.get(url, { responseType: 'text' });
  }






}
