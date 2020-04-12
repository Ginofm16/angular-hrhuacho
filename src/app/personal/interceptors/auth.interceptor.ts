import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService,
        private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
        catchError(e => {
            if (e.status == 401) {
                /*estamos autenticados en angular pero el token expira en backend, tambien el 401 se 
                va generar al querer acceder a un recurso */
                /* se tiene que cerrar la sesion por el lado del Frontend, pero se tiene q preguntar 
                si esta esta autenticado se cerrara la sesion*/
                if (this.authService.isAuthenticated()) {
                  this.authService.logout();
                }
      
                this.router.navigate(['/login']);
      
              }

              if (e.status == 403) {
                Swal.fire('Acceso denegado', `Hola ${this.authService.personal.username} no tienes acceso a este recurso!`, 'warning');
                this.router.navigate(['/historias']);
      
              }
              return throwError(e);
        })
    );
  }
}