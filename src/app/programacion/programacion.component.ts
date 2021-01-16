import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Consultorio } from '../calendar/consultorio';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProgramacionService } from './programacion.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-programacion',
  templateUrl: './programacion.component.html',
  styleUrls: ['./programacion.component.css']
})
export class ProgramacionComponent implements OnInit {

  consultorios: Consultorio[];
  
  consultorioSeleccionado: Consultorio;

  constructor(private programacionService: ProgramacionService, private router: Router, private http: HttpClient) { }

  ngOnInit() {

      this.getConsultorios().subscribe(consultorio => {
      this.consultorios = consultorio;
    })
    
  }

  getConsultorios(): Observable<any[]>{
    return this.http.get<Consultorio[]>(`${environment.HOST}/api/consultorios`);
  }

  //[routerLink]="['/programacion/mantenimiento']
  //this.router.navigate(['/historias']);
  irMantenimiento(){
    this.router.navigate(['/programacion/mantenimiento']);
    //this.programacionService.recibirDato(this.consultorioSeleccionado.con_codigo);
  }

}
