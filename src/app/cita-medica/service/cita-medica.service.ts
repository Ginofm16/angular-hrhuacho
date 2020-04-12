import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { Historia } from 'src/app/historia/historia';

@Injectable({
  providedIn: 'root'
})
export class CitaMedicaService {

  private urlEndPoint: string = 'http://localhost:8080/api/historias';

  constructor(private http: HttpClient) { }

  filtrarHistorias(term:string):Observable<Historia[]>{
    return this.http.get<Historia[]>(`${this.urlEndPoint}/filtrar-historias/${term}`);
  }
}
