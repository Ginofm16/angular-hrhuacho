import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Programacion } from './programacion';
import Swal from 'sweetalert2';
import { Personal } from '../personal/personal';
import { Consultorio } from '../consultorio/consultorio';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ProgramacionService {

  programaciones: Programacion[];

  codConsultorio: String;


  private urlEndPoint: string = 'http://localhost:8080/api/programacion';

  constructor(private http: HttpClient, private router: Router) { }

  getProgramacionesIndex(): Observable<any> {
    return this.http.get(this.urlEndPoint).pipe(

      map((response: any) => {
        this.programaciones = response.content as Programacion[];

        return response;
      })
    );
  }


  create(programacion: Programacion): Observable<Programacion> {
    console.log("Create::::::::");
    console.log(programacion);
    return this.http.post(this.urlEndPoint, programacion).pipe(
      map((response: any) => response.programacion as Programacion),
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

  getProgramacion(codigo): Observable<Programacion> {
    return this.http.get<Programacion>(`${this.urlEndPoint}/${codigo}`).pipe(
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

  update(programacion: Programacion): Observable<any> {
    console.log("UPDATE SERVICE ::::::::::");
    console.log(programacion);
    return this.http.put<any>(`${this.urlEndPoint}/${programacion.pro_codigo}`, programacion).pipe(
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

  delete(codigo: number): Observable<Programacion> {
    /*se envia una peticion de tipo DElETE, porque se quiere eliminar, y se pasa la url*/
    return this.http.delete<Programacion>(`${this.urlEndPoint}/${codigo}`).pipe(
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

  getPersonales(): Observable<Personal[]> {

    return this.http.get<Personal[]>(this.urlEndPoint + '/personal');

  }

  getConsultorios(): Observable<Consultorio[]> {

    return this.http.get<Consultorio[]>(this.urlEndPoint + '/consultorio');

  }

  recibirDato(codConsultorio) {
    console.log("SSSSSSSSSSSSSEEEEEEERVVV" + codConsultorio);
    this.codConsultorio = codConsultorio;
  }

}
