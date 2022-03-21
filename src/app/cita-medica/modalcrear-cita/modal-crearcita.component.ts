import { ModalCrearcitaService } from './../../cuerpo/service/modal-crearcita.service';
import { Component, Input, OnInit } from '@angular/core';
import { Historia } from 'src/app/historia/historia';
import { FormControl, FormGroup } from '@angular/forms';
import { CitaMedica } from '../cita-medica';
import { ProgramacionFilter } from '../formulario/programacionFilter';
import { Programacion } from 'src/app/programacion/programacion';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/personal/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CitaMedicaService } from '../service/cita-medica.service';
import { HistoriaService } from 'src/app/historia/historia.service';
import { ProgramacionService } from 'src/app/programacion/programacion.service';
import { flatMap, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-crearcita',
  templateUrl: './modal-crearcita.component.html',
  styleUrls: ['./modal-crearcita.component.css']
})
export class ModalCrearcitaComponent implements OnInit {

  @Input() historia: Historia;
  
  form: FormGroup;

  private citaMedica:CitaMedica = new CitaMedica();
  private newCitaMedica: CitaMedica;
  private titulo: string = "Crear Cita Medica";
  private editar: boolean=false;
  private testVisible: boolean=true;

  pdfSrc: string;

  programacionFilter: ProgramacionFilter = new ProgramacionFilter();
  codigoUsuarioParam : any;

  private errores: string[];
  programaciones: Programacion[];

  //para obtener el programacion del autocomplete
  programacionSeleccionado: Programacion;

  //utiles para el autocomplete
  myControlProgramacion = new FormControl();
  programacionFiltrados: Observable<Programacion[]>;

  constructor(private modalCrearcitaService: ModalCrearcitaService,
    private authService:AuthService,
              private router:Router,
              private activatedRoute: ActivatedRoute,
              private citaMedicaService: CitaMedicaService,
              private historiaService: HistoriaService,
              private programacionService: ProgramacionService) { }

  ngOnInit() {

    this.programacionFiltrados = this.myControlProgramacion.valueChanges
      .pipe(
        /*se usara map, porque el valor no es solo el string, sino tambien el objeto producto que 
        contiene el nombre*/
        map(value => typeof value === 'string' ? value : value.consultorio.con_nombre),
        /*faltMap, va "aplanar" los valores de un observable dentro de otro observable .
        Podemos una condicional, donde si existe el valor(que no sea null o indefinido)
        se retorna los valores filtrados, sino un array vacio*/
        flatMap(value => value ? this._filter(value) : [])
      );
  }

  private _filter(value: string): Observable<Programacion[]> {
    const filterValue = value.toLowerCase();
    /*.includes(filterValue), aca se compara el valor ingresado con las lista de productos*/
    return this.programacionService.filtrarProgramaciones(filterValue);
  }

  existeItem(id: number): boolean {
    let existe = false;
    this.programacionFilter.items.forEach((item: Programacion) => {
      if (id === item.pro_codigo) {
        existe = true;
      }
    });
    return existe;

  }

  seleccionarProgramacion(event: MatAutocompleteSelectedEvent): void {
    let nuevoItem = new Programacion();
     nuevoItem = event.option.value as Programacion;
     console.log("Pre nuevoItem");
     console.log(nuevoItem);
     console.log("Post nuevoItem");
     this.programacionSeleccionado = nuevoItem;



    if (this.existeItem(nuevoItem.pro_codigo)) {
      Swal.fire(this.titulo, `Programación ${nuevoItem.consultorio.con_nombre} ya fue encontrado`, 'info');
    } else {
      console.log('nuevoItemsssss');
      
      this.programacionFilter.items.push(nuevoItem);

      console.log(this.programacionFilter.items)
    }

    /*para buscar otro producto y agregar otra linea se tiene que limpiar el autocomplete*/
    //this.myControlProgramacion.setValue('');
    event.option.focus();
    event.option.deselect();

  }

  mostrarProgramacion(programacion?: Programacion): string | undefined {

    return programacion ? programacion.consultorio.con_nombre +" "+programacion.pro_fecha: undefined;
  }

  create(num_turno: number): void{
    console.log("create_::::::::::::");
    console.log(num_turno);
    if (num_turno === 0){
      console.log("::::::::: 0 ::::::::")
      Swal.fire( `No hay turno disponible para ${this.programacionSeleccionado.consultorio.con_nombre}`);
    }else {
      this.citaMedica.programacion = this.programacionSeleccionado;
      this.citaMedica.usuario = this.authService.usuario;
      this.citaMedica.historia = this.historia;
      this.citaMedica.cit_estado = true;
      console.log(":::::cit_exoneracion:::::");
      console.log(this.citaMedica.cit_exoneracion);
      if(this.citaMedica.cit_exoneracion != null){
        this.citaMedica.cit_costo_total = this.citaMedica.programacion.consultorio.con_precio - this.citaMedica.cit_exoneracion;
      }else{
        this.citaMedica.cit_costo_total = this.citaMedica.programacion.consultorio.con_precio;
      }
      
      this.citaMedicaService.create(this.citaMedica)
      .subscribe(json => {

        this.modalCrearcitaService.notificarRegistro.emit(this.citaMedica);

        Swal.fire('Nueva CitaMedica',`La citaMedica número: ${json.citaPaciente.cit_codigo} para: ${json.citaPaciente.historia.his_nombre}
        ha sido creado con exito`,'success');
        this.descargarReporte();
        
      },
        err =>{
          this.errores = err.error.errors as string[];
          console.error('Código del error desde el backend' + err.status);
          console.error(err.error.errors);
        }
      )
      this.cerrarModal();
      console.log('pre navigate');
      this.router.navigate(['/cuerpo']);
      
    }
    
  }

  limpiar(){
    this.programacionSeleccionado = null;
    this.myControlProgramacion.reset();
    
  }

  cerrarModal(){
    
    this.modalCrearcitaService.cerrarModal();
    this.programacionSeleccionado = null;
    this.myControlProgramacion.reset();
  }

  generarReporte(){
    console.log(":::::::generarReporte::::::::::");
    this.citaMedicaService.generarReporte().subscribe(data => {
      let reader = new FileReader();
      //onload, lee el arreglo de byte y lo expresa como una url que lo almaceno en pdfSrc
      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
        console.log(this.pdfSrc);
      }
      //finalmente todo es pasado como un buffer para que pueda ser leido
      reader.readAsArrayBuffer(data);

    });
  }

  descargarReporte(){
    this.citaMedicaService.generarReporte().subscribe(data =>{
      //generar un url del arreglo de byte
      const url = window.URL.createObjectURL(data);
      //console.log(url);
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'archivo.pdf';
      a.click();
    });
  }

}
