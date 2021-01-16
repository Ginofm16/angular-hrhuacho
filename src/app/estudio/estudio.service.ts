import { Estudio } from './estudio';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstudioService {

  private urlEndPoint:string = `${environment.HOST}/api/estudios`;

  estudios: Estudio[];

  constructor(private http: HttpClient, private router: Router) { }

  getEstudiosIndex(): Observable<any> {
    return this.http.get(this.urlEndPoint).pipe(

      map((response: any) => {
        this.estudios = response.content as Estudio[];

        return response;
      })
    );
  }

}
