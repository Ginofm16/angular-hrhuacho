import { UsuarioRegistro } from './usuarioRegistro';
import { RespuestaValidacion } from './registro/respuestaValidacion';
import  Swal from 'sweetalert2';
import { Personal } from './personal';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Categoria } from './categoria';
import { Especialidad } from './especialidad';
import { Pais } from '../pais/pais';
import { TipoDocumento } from '../tipo-documento/tipoDocumento';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  personales: Personal[];
  personalCambio = new Subject<Personal[]>();
  personal: Personal;

  private urlEndPoint: string = `${environment.HOST}/api/personal`;
  private urlEndPointApi: string = `${environment.HOST}/api`;

  constructor(private http: HttpClient, private router: Router) { }

  getPersonalesIndex(): Observable<any> {
    return this.http.get(this.urlEndPoint).pipe(

      map((response: any) => {
        this.personales = response.content as Personal[];

        return response;
      })
    );
  }

  getPersonal(codigo):Observable<Personal>{
    return this.http.get<Personal>(`${this.urlEndPoint}/${codigo}`).pipe(
      /*aca dentro se puede tener los operadores del flujo. catchError, obtenemos el error por argumento*/
      catchError(e => {
        if(e.status != 401 && e.error.mensaje){
        this.router.navigate(['/personal']);

        console.error(e.error.mensaje);
        }
        /*cuando ocurra el error la idea es de que retorne o regrese al listado de cliente, por ello
        se utiliza el router para redirigir a Clientes, al listado*/
        /*retornar el error, en un tipo Observable*/
        return throwError(e);
      })
    );
  }

  create(personal: Personal): Observable<Personal> {

    return this.http.post(this.urlEndPoint, personal).pipe(
      map((response: any) => response.personal as Personal),
      catchError(e => {
        if (e.status == 400){
          return throwError(e);
        }

        if(e.error.mensaje){
          console.error(e.error.mensaje);
        }

        return throwError(e);
      })
    )
  }

  update(personal: Personal): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${personal.per_codigo}`, personal).pipe(
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

  delete(codigo: number): Observable<Personal> {
    return this.http.delete<Personal>(`${this.urlEndPoint}/${codigo}`).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        Swal.fire(
          e.error.mensaje,
          e.error.error,
          'error'
        );

        return throwError(e);
      })
    )
  }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.urlEndPoint+'/categoria');
  }

  getEspecialidad(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(this.urlEndPoint+'/especialidad');
  }

  getPaises(): Observable<Pais[]> {
    return this.http.get<Pais[]>(this.urlEndPointApi+'/paises');
  }

  getTipoDocumento(): Observable<TipoDocumento[]> {
    return this.http.get<TipoDocumento[]>(this.urlEndPoint+'/tipo-documento');
  }

 
  getPersonalByCorreo(correo: string): Observable<RespuestaValidacion>{
    console.log("In getPersonalByCorreo:::");
    return this.http.get<RespuestaValidacion>(this.urlEndPoint+'/personal-correo/'+correo).pipe(
      
      catchError(e => {
        console.log(":::::catchError:::::");
        console.log(e.error.mensaje);
        Swal.fire(e.error.mensaje)
        return throwError(e);
      })
    )
  }

  getPersonalByUsuario(usuario: string): Observable<RespuestaValidacion>{
    return this.http.get<RespuestaValidacion>(this.urlEndPoint+'/personal-usuario/'+usuario).pipe(

      catchError(e => {
        console.log(":::::catchError:::::");
        console.log(e.error.mensaje);
        Swal.fire(e.error.mensaje)
        return throwError(e);
      })
    )
  }

  updatePersonalUsuario(usuarioRegistro: UsuarioRegistro): Observable<any>{
    console.log(":::::method updatePersonalUsuario::::::");
    console.log(usuarioRegistro);
    return this.http.post<any>(this.urlEndPoint+'/actualizar-usuario', usuarioRegistro).pipe(
      catchError(e => {
        console.error(e.error);
        //Swal.fire(e.error.mensaje);
        return throwError(e);
      })
    )
  }

}
