import { PersonalService } from './../../personal/personal.service';
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
import { Personal } from 'src/app/personal/personal';
import { environment } from 'src/environments/environment';

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
  personal: Personal;

  @Input() consultorio: Consultorio;

  horariosCalendar: CalendarEvents[];
  iterador: number;
  numProgra: number;


  calendarPlugins = [dayGridPlugin];

  public locales = [esLocale];

  private urlEndPoint:string = `${environment.HOST}/api/programacion`;

  constructor(private calendarService: CalendarService, 
    private router: Router, 
    private http: HttpClient,
    private personalService: PersonalService) { }
  
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

    this.getCalendar(this.consultorio.con_codigo).subscribe(events => {
    

      this.iterador = 0;
      this.numProgra = events.length;
      this.horariosCalendar = new Array(this.numProgra);

      console.log(this.numProgra);
      let hora;

      (events).forEach(event => {
        
        if (event.pro_hora_inicio >= '12:00' ) {
          if (event.pro_hora_inicio >= '01:00' ) {
            if (event.pro_hora_inicio < '20:00') {
             hora = '0' + (parseInt(event.pro_hora_inicio.substring(0, 2)) - 12) + ':' + event.pro_hora_inicio.substring(3) + ' PM';
              event.pro_hora_inicio = hora;
            }else{
               hora = (parseInt(event.pro_hora_inicio.substring(0, 2)) - 12) + ':' + event.pro_hora_inicio.substring(3) + ' PM';
              event.pro_hora_inicio = hora;
            }
          }else{
             hora = (parseInt(event.pro_hora_inicio.substring(0, 2)) - 12) + ':' + event.pro_hora_inicio.substring(3) + ' PM';
            event.pro_hora_inicio = hora;
          }

        } else {
           hora = event.pro_hora_inicio + ' AM';
          event.pro_hora_inicio = hora;
        }


        //this.horariosCalendar[this.iterador] = {start: event.pro_fecha, title: event.consultorio.con_nombre+"\n"+event.pro_hora_inicio+"\n"+event.personal.per_nombre+" "+event.personal.per_ape_paterno}
        this.horariosCalendar[this.iterador] = {start: event.pro_fecha, title: event.consultorio.con_nombre+"\n"+hora+"\n"+event.usuario.personal.per_nombre+" "+event.usuario.personal.per_ape_paterno}
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
