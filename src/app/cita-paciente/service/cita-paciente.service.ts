import { CitaPaciente } from './../citaPaciente';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CitaPacienteService {

  private urlEndPoint: string = `${environment.HOST}/api/cita-paciente`;

  constructor(private http: HttpClient, private router: Router) { }


  obtenerCitaPacientes(fecha:string, codigo:string):Observable<CitaPaciente[]>{
    return this.http.get<CitaPaciente[]>(`${this.urlEndPoint}/consultorio/${codigo}/fecha/${fecha}`);
  }

}
