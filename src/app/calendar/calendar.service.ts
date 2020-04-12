import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { cCalendar } from './calendar';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map} from 'rxjs/operators';
import { Consultorio } from '../consultorio/consultorio';


@Injectable()
export class CalendarService {

  calendar: cCalendar[];

  private urlEndPoint:string = 'http://localhost:8080/api/programacion';

  constructor(private http: HttpClient, private router: Router) { 

  }

  getCalendar(): Observable<cCalendar[]>{

    return this.http.get<cCalendar[]>(this.urlEndPoint);

  }
  
  getData(): Observable<any[]>{
    let data = 
    [
      {start:'2019-12-31', title:'Programacion \n Java'}, {start:'2020-01-24', title:'Programacion \n Angular'}
    ]

    return of(data);
  }

  getConsultorios(): Observable<any[]>{
    return this.http.get<Consultorio[]>('http://localhost:8080/api/consultorios');
  }

}
