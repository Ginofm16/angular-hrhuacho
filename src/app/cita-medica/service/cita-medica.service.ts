import { Programacion } from './../../programacion/programacion';
import { CitaMedica } from './../cita-medica';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { Historia } from 'src/app/historia/historia';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CitaMedicaService {

  citaMedicas: CitaMedica[];
  codCitaMedica: String;

  citaMedicaCambio = new Subject<CitaMedica[]>();
  private urlEndPoint: string = `${environment.HOST}/api/citaPaciente`;

  constructor(private http: HttpClient, private router: Router) { }
  /* 
  filtrarHistorias(term:string):Observable<Historia[]>{
    return this.http.get<Historia[]>(`${this.urlEndPoint}/filtrar-historias/${term}`);
  }*/

  getCitaMedicaIndex(): Observable<any> {
    return this.http.get(this.urlEndPoint).pipe(

      map((response: any) => {
        this.citaMedicas = response.content as CitaMedica[];

        return response;
      })
    );
  }

  create(citaMedica: CitaMedica): Observable<CitaMedica> {

    return this.http.post(this.urlEndPoint, citaMedica).pipe(
      map((response: any) => response.citaMedica as CitaMedica),
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }

        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }

        return throwError(e);
      })
    )
  }

  getCitaMedica(codigo): Observable<CitaMedica> {
    return this.http.get<CitaMedica>(`${this.urlEndPoint}/${codigo}`).pipe(
      /*aca dentro se puede tener los operadores del flujo. catchError, obtenemos el error por argumento*/
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/historias']);

          console.error(e.error.mensaje);
        }
        /*cuando ocurra el error la idea es de que retorne o regrese al listado de cliente, por ello
        se utiliza el router para redirigir a Clientes, al listado*/
        /*retornar el error, en un tipo Observable*/
        return throwError(e);
      })
    );
  }

  update(citaMedica: CitaMedica): Observable<any> {
    console.log(citaMedica);
    return this.http.put<any>(`${this.urlEndPoint}/${citaMedica.cit_codigo}`, citaMedica).pipe(
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }

        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          Swal.fire(
            e.error.mensaje,
            e.error.error,
            'error'
          );
        }

        return throwError(e);
      })
    )
  }

  delete(codigo: number): Observable<CitaMedica> {
    /*se envia una peticion de tipo DElETE, porque se quiere eliminar, y se pasa la url*/
    return this.http.delete<CitaMedica>(`${this.urlEndPoint}/${codigo}`).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        Swal.fire(
          /*mensaje y err*/
          e.error.mensaje,
          e.error.error,
          'error'
        );
        /*en este caso no es necesario enviar a otra pagina (utilzando router), porque
        la idea es permanecer dentro del formulario para corregir el error*/
        return throwError(e);
      })
    )
  }

  
}
