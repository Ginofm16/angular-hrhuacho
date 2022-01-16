import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppComponent } from './app.component';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { MenuComponent } from './menu/menu.component';
import { CuerpoComponent } from './cuerpo/cuerpo.component';
import { HistoriasComponent } from './historia/historias.component';
import { PaginadorComponent } from './paginador/paginador.component';
import { FormularioComponent } from './historia/formulario/formulario.component';

import {RouterModule, Routes} from '@angular/router';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatButtonModule } from'@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';

import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { HistoriaService } from './historia/historia.service';

import { DetalleComponent } from './historia/detalle/detalle.component';
import { LoginComponent } from './personal/login/login.component';
import { TokenInterceptor } from './personal/interceptors/token.interceptor';
import { AuthInterceptor } from './personal/interceptors/auth.interceptor';
import { CitaMedicaComponent } from './cita-medica/cita-medica.component';

import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CuerpoService } from './cuerpo/service/cuerpo.service';


import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarComponent } from './calendar/calendar/calendar.component';
import { ProgramacionComponent } from './programacion/programacion.component';
import { ConsultorioComponent } from './consultorio/consultorio.component';
import { CalendarService } from './calendar/calendar.service';
import { FormprogramacionComponent } from './programacion/formulario/formprogramacion/formprogramacion.component';
import { MantprogramacionComponent } from './programacion/mantenimiento/mantprogramacion/mantprogramacion.component';


import { DataTablesModule } from 'angular-datatables';
import { FormCitamedicaComponent } from './cita-medica/formulario/form-citamedica.component';
import { FormCrearcitaComponent } from './cita-medica/formulariocrear/form-crearcita.component';
import { ModalCrearcitaComponent } from './cita-medica/modalcrear-cita/modal-crearcita.component';

registerLocaleData(localeES, 'es');

const routes: Routes = [
  {path:'', redirectTo:'/login', pathMatch:'full'},
  {path:'historias', component: HistoriasComponent},
  {path:'historias/formulario', component: FormularioComponent},
  {path:'historias/formulario/:codigo', component: FormularioComponent},
  {path:'historias/page/:page', component: HistoriasComponent},
  {path:'cuerpo', component: CuerpoComponent},
  {path:'login', component: LoginComponent},
  {path:'cita-medica/crearform/:id', component: FormCrearcitaComponent},
  {path:'cita-medica/formulario/:id', component: FormCitamedicaComponent},
  {path:'cita-medica/formulario', component: FormCitamedicaComponent},
  {path:'cita-medica', component: CitaMedicaComponent},
  {path:'calendar', component: CalendarComponent},
  {path:'programacion', component:ProgramacionComponent},
  {path:'programacion/mantenimiento', component:MantprogramacionComponent},
  {path:'programacion/formulario', component:FormprogramacionComponent},
  {path:'programacion/formulario/:codigo', component:FormprogramacionComponent}


]

@NgModule({
  declarations: [
    AppComponent,
    CabeceraComponent,
    MenuComponent,
    CuerpoComponent,
    HistoriasComponent,
    PaginadorComponent,
    FormularioComponent,
    DetalleComponent,
    LoginComponent,
    CitaMedicaComponent,
    CalendarComponent,
    ProgramacionComponent,
    ConsultorioComponent,
    FormprogramacionComponent,
    MantprogramacionComponent,
    FormCitamedicaComponent,
    FormCrearcitaComponent,
    ModalCrearcitaComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    BrowserAnimationsModule, MatDatepickerModule, MatMomentDateModule,
    MatButtonModule,
    MatRadioModule,
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatSelectModule,
    FullCalendarModule,
    DataTablesModule
  ],
  providers: [HistoriaService, CuerpoService,CalendarService, {provide: LOCALE_ID, useValue:'es'},
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ], 
  
  bootstrap: [AppComponent]
})
export class AppModule { }
