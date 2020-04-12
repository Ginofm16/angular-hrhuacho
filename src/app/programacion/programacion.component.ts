import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../calendar/calendar.service';
import { Router } from '@angular/router';
import { Consultorio } from '../calendar/consultorio';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-programacion',
  templateUrl: './programacion.component.html',
  styleUrls: ['./programacion.component.css']
})
export class ProgramacionComponent implements OnInit {

  consultorios: Consultorio[];
  
  consultorioSeleccionado: Consultorio;

  constructor(private calendarService: CalendarService, private router: Router, private http: HttpClient) { }

  ngOnInit() {

    this.getConsultorios().subscribe(consultorio => {
      this.consultorios = consultorio;
    })
    
  }

  getConsultorios(): Observable<any[]>{
    return this.http.get<Consultorio[]>('http://localhost:8080/api/consultorios');
  }


}
