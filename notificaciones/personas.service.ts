import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Personas } from './personas.model'; // Asegúrate de importar el modelo de personas

@Injectable({
  providedIn: 'root'
})
export class PersonasService {

  private apiUrl = 'https://localhost:44397/api'; // Reemplaza con la URL de tu backend

  constructor(private http: HttpClient) { }

  consultarPersonasPorFraccionamiento(idFraccionamiento: number): Observable<Personas[]> {
    const url = `https://localhost:44397/api/Usuarios/Consultar_Personas_Por_Fraccionamiento?id_fraccionamiento=${idFraccionamiento}`;
    return this.http.get<Personas[]>(url);
  }
}
