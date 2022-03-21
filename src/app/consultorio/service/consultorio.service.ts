import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Consultorio } from '../consultorio';

@Injectable({
  providedIn: 'root'
})
export class ConsultorioService {

  private urlEndPoint: string = `${environment.HOST}/api/programacion`;

  constructor(private http: HttpClient, private router: Router) { }


  getConsultorios(): Observable<Consultorio[]> {

    return this.http.get<Consultorio[]>(this.urlEndPoint + '/consultorio');

  }
}
