import { CitaMedicaService } from './../cita-medica/service/cita-medica.service';

import { CitaPacienteIn } from './citaPacienteIn';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ConsultorioService } from '../consultorio/service/consultorio.service';
import { Consultorio } from '../consultorio/consultorio';
import { PersonalService } from '../personal/personal.service';
import { Pais } from '../pais/pais';
import { CitaPaciente } from './citaPaciente';
import { CitaPacienteService } from './service/cita-paciente.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cita-paciente',
  templateUrl: './cita-paciente.component.html',
  styleUrls: ['./cita-paciente.component.css']
})
export class CitaPacienteComponent implements OnInit, OnDestroy{

  
  private titulo: string = "BUSQUEDA DE PACIENTES CITADOS";
  private citaPacienteIn:CitaPacienteIn = new CitaPacienteIn();
  consultorios: Consultorio[];
  private cita_pacientes: CitaPaciente[];
  dtOptions: DataTables.Settings = {};
  contador: number = 0;

  dtTrigger: Subject<any> = new Subject<any>();


  paises: Pais[];

  constructor(private consultorioService : ConsultorioService,
    private personalService: PersonalService,
    private citaPacienteService: CitaPacienteService,
    private zone: NgZone,
    private router: Router) { console.log(":::citaPaciente constructor:::::");}
  


  ngOnInit() {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 5,
    };
    console.log(":::citaPaciente ngOnInit:::::");
    this.consultorioService.getConsultorios().subscribe(consuls => this.consultorios = consuls);
  }

  buscar(){
    this.personalService.getPaises().subscribe(paises => this.paises = paises);

    this.citaPacienteService.obtenerCitaPacientes(this.citaPacienteIn.fechaProgramacion,
      this.citaPacienteIn.cod_consultorio).subscribe(citaPacientes => {

        this.cita_pacientes = citaPacientes
        this.dtTrigger.next();
      });
    console.log(":::citaPacienteIn:::::");
    console.log(this.citaPacienteIn.fechaProgramacion);
    console.log(this.citaPacienteIn.cod_consultorio);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  limpiarBusqueda(){
    this.cita_pacientes = null;
  }

  reloadPage() {
    //click handler or similar
    this.zone.runOutsideAngular(() => {
      location.reload();
      this.contador = this.contador + 1;
    });
  }

}
