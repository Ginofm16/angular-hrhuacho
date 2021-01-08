import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarService } from '../calendar.service';
import { cCalendar } from '../calendar';
import { Router } from '@angular/router';
import { CalendarEvents } from '../calendar-events';
import { tap } from 'rxjs/operators';
import { Calendar } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';
import { Consultorio } from 'src/app/consultorio/consultorio';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Pais } from 'src/app/historia/pais';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

//export class CalendarComponent implements OnInit {
export class CalendarComponent implements OnChanges {

  calendarEvents: any[] =[ ];

  calendarPro: cCalendar[];
  consultorios: Consultorio[];


  @Input() consultorio: Consultorio;

  horariosCalendar: CalendarEvents[];
  iterador: number;
  numProgra: number;


  calendarPlugins = [dayGridPlugin];

  public locales = [esLocale];

  private urlEndPoint:string = 'http://localhost:8080/api/programacion';

  constructor(private calendarService: CalendarService, 
    private router: Router, 
    private http: HttpClient) { }
  
    /*
  ngOnInit(): void {

    console.log("OnInit:::::::::::::"+ this.consultorio.con_nombre);
    this.calendarService.getCalendar().subscribe(events => {

      this.iterador = 0;
      this.numProgra = events.length;
      this.horariosCalendar = new Array(this.numProgra);

      console.log(this.numProgra);

      (events).forEach(event => {
        this.horariosCalendar[this.iterador] = {start: event.pro_fecha, title: event.consultorio.con_nombre+"\n"+event.pro_hora_inicio+""+event.pro_sigla+"\n"+event.personal.per_nombre+" "+event.personal.per_ape_paterno}
        this.iterador = this.iterador + 1;
      })
      console.log(this.horariosCalendar);
      this.calendarEvents = this.horariosCalendar;

    })

    this.calendarService.getConsultorios().subscribe(consultorios => {
      this.consultorios = consultorios;
      
    console.log(this.consultorios);
    })

    
  }
*/
  ngOnChanges(changes: SimpleChanges) {

    console.log("OnChanges_BEFORE::::"+ this.consultorio.con_codigo);
    this.getCalendar(this.consultorio.con_codigo).subscribe(events => {
    
      
      console.log("OnChanges_AFTER::::"+ changes.consultorio.currentValue.con_codigo);

      this.iterador = 0;
      this.numProgra = events.length;
      this.horariosCalendar = new Array(this.numProgra);

      console.log(this.numProgra);

      (events).forEach(event => {
        this.horariosCalendar[this.iterador] = {start: event.pro_fecha, title: event.consultorio.con_nombre+"\n"+event.pro_hora_inicio+""+event.pro_sigla+"\n"+event.personal.per_nombre+" "+event.personal.per_ape_paterno}
        this.iterador = this.iterador + 1;
      })
      console.log(this.horariosCalendar);
      this.calendarEvents = this.horariosCalendar;
    }
    );
  }

  getCalendar(codigo:Number): Observable<cCalendar[]>{

    return this.http.get<cCalendar[]>(`${this.urlEndPoint}/consultorio/${codigo}`);

  }

  compararPais(p1: Pais, p2:Pais): boolean{
    if(p1 == undefined && p2 == undefined){
      return true;
    }
    return p1==null || p2==null || p1== undefined || p2== undefined ? false: p1.pais_codigo == p2.pais_codigo;
  }

}
