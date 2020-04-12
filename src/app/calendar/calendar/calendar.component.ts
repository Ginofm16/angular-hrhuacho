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

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

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

  constructor(private calendarService: CalendarService, private router: Router, private http: HttpClient) { }
/*
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    console.log("sdsdasdCONSULTORIO");
    /*
    if (changes.consultorioSeleccionado.currentValue != changes.consultorioSeleccionado.previousValue){
      let nuevoConsul = changes.consultorioSeleccionado.currentValue;
      this.calendarService.getCalendar().subscribe(events => {
        (events).forEach(event => {
          if(event.consultorio.con_codigo == nuevoConsul.con_codigo){
            console.log("sdsdasdCONSULTORIOsdffsdfsdf");
          }
        })
      })
    }
    /
  }*/


  ngOnInit() {

    console.log("================================================");

    //this.calendarService.getCalendar().subscribe(events => {
    this.getCalendar(this.consultorio.con_codigo).subscribe(events => {
     
      console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTt");

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

    return this.http.get<cCalendar[]>(`${this.urlEndPoint}/consul/${codigo}`);

  }

  

}
