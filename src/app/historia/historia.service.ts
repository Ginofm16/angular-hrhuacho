import { Injectable } from '@angular/core';
import { formatDate, DatePipe} from '@angular/common';
import { Historia } from './historia';
import { Pais } from './pais';
import { Observable, throwError} from 'rxjs';
import { of } from 'rxjs';
import { HttpClient, HttpRequest, HttpEvent} from '@angular/common/http';
import { map, catchError, tap} from 'rxjs/operators';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Injectable()
export class HistoriaService{

    codCon:String;

historias: Historia[];

    private urlEndPoint:string = 'http://localhost:8080/api/historias';

    constructor(private http: HttpClient, private router: Router){}

    getHistorias(page: number): Observable<any>{
        this.codCon  = "4";
        return this.http.get(this.urlEndPoint+'/page/'+page+'/codigo/'+this.codCon).pipe(

            map((response:any) => {
                this.historias = response.content as Historia[];

                this.historias.map(historias => {
                    historias.his_nombre = historias.his_nombre.toLocaleLowerCase();
                    
                    let datePipe = new DatePipe('es');

                    return this.historias;
                });


                return response;
            })
        );
    }

    getHistoriasIndex(): Observable<any>{
        return this.http.get(this.urlEndPoint).pipe(

            map((response:any) => {
                this.historias = response.content as Historia[];

                return response;
            })
        );
    }

    getPaises(): Observable<Pais[]>{

        return this.http.get<Pais[]>(this.urlEndPoint+'/paises');

    }

    create(historia: Historia):Observable<Historia>{

        return this.http.post(this.urlEndPoint, historia).pipe(
            map((response: any)=> response.historia as Historia),
            catchError(e => {
                if(e.status==400){
                    return throwError(e);
                }

                if(e.error.mensaje){
                  console.error(e.error.mensaje);
                 }

                return throwError(e);
            })
        )
    }

    getHistoria(codigo):Observable<Historia>{
        return this.http.get<Historia>(`${this.urlEndPoint}/${codigo}`).pipe(
          /*aca dentro se puede tener los operadores del flujo. catchError, obtenemos el error por argumento*/
          catchError(e => {
            if(e.status != 401 && e.error.mensaje){
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

      update(historia: Historia):Observable<any>{
        return this.http.put<any>(`${this.urlEndPoint}/${historia.his_codigo}`,historia).pipe(
            catchError(e =>{
                if(e.status==400){
                    return throwError(e);
                }

                if(e.error.mensaje){
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

    delete(codigo:number): Observable<Historia>{
        /*se envia una peticion de tipo DElETE, porque se quiere eliminar, y se pasa la url*/
        return this.http.delete<Historia>(`${this.urlEndPoint}/${codigo}`).pipe(
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
