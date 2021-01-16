import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Historia } from 'src/app/historia/historia';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CuerpoService {

  private urlEndPoint: string = `${environment.HOST}/api/historias`;

  constructor(private http: HttpClient) { }

  filtrarHistorias(term:string):Observable<Historia[]>{
    return this.http.get<Historia[]>(`${this.urlEndPoint}/filtrar-historias/${term}`);
    
}
}
