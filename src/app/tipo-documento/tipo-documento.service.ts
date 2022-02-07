import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TipoDocumento } from './tipoDocumento';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {

  tipoDocumentos: TipoDocumento[];

  private urlEndPoint: string = `${environment.HOST}/api/tipo-documento`;

  constructor(private http: HttpClient) { }


  getTipoDocumentoIndex(): Observable<any> {
    return this.http.get(this.urlEndPoint).pipe(
      map((response : any) => {
        this.tipoDocumentos = response.content as TipoDocumento[];
        return response;
      })
    )
  }

}
