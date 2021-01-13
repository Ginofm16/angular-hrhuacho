import { Personal } from './personal';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  personales: Personal[];

  private urlEndPoint: string = 'http://localhost:8080/api/personal';

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

}
