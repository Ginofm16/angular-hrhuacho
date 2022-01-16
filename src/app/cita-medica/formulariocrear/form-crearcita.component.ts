import { HistoriaService } from './../../historia/historia.service';
import { ProgramacionService } from './../../programacion/programacion.service';
import { Usuario } from './../../personal/login/usuario';
import { Programacion } from './../../programacion/programacion';
import { CitaMedicaService } from './../service/cita-medica.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/personal/auth.service';
import { CitaMedica } from '../cita-medica';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { flatMap, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ProgramacionFilter } from '../formulario/programacionFilter';
import { Historia } from 'src/app/historia/historia';

@Component({
  selector: 'app-form-crearcita',
  templateUrl: './form-crearcita.component.html',
  styleUrls: ['./form-crearcita.component.css']
})
export class FormCrearcitaComponent implements OnInit {

  form: FormGroup;

  private citaMedica:CitaMedica = new CitaMedica();
  private titulo: string = "Crear Cita Medica";
  private editar: boolean=false;
  private historia: Historia;

  programacionFilter: ProgramacionFilter = new ProgramacionFilter();

  private errores: string[];
  programaciones: Programacion[];

  //para obtener el programacion del autocomplete
  programacionSeleccionado: Programacion;

  //utiles para el autocomplete
  myControlProgramacion = new FormControl();
  programacionFiltrados: Observable<Programacion[]>;

  estados = [
    {valor:false, muestraValor:'Inactivo'},
    {valor:true, muestraValor:'Activo'}
  ];

  constructor(private authService:AuthService,
              private router:Router,
              private activatedRoute: ActivatedRoute,
              private citaMedicaService: CitaMedicaService,
              private historiaService: HistoriaService,
              private programacionService: ProgramacionService) { }

  ngOnInit() {
    console.log("****")
    console.log(this.authService.usuario);
    this.cargarCitaMedicas();

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
     this.programacionSeleccionado = nuevoItem;
     console.log("seleccionarProgramacion:::::::::");
     console.log(this.programacionSeleccionado);

    if (this.existeItem(nuevoItem.pro_codigo)) {
      Swal.fire(this.titulo, `Usuario ${nuevoItem.consultorio.con_nombre} ya fue encontrado`, 'info');
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
    console.log("MOSTRAR NOMBRE");
    console.log(programacion);
    return programacion ? programacion.consultorio.con_nombre +" "+programacion.pro_fecha: undefined;
  }

  create(): void{
    this.citaMedica.programacion = this.programacionSeleccionado;
    this.citaMedica.usuario = this.authService.usuario;
    this.citaMedica.historia = this.historia;
    this.citaMedica.cit_estado = true;
    this.citaMedica.cit_costo_total = this.citaMedica.programacion.consultorio.con_precio - this.citaMedica.cit_exoneracion;
    console.log(this.citaMedica);
    this.citaMedicaService.create(this.citaMedica)
    .subscribe(json => {
      console.log("CREATE::.::");
      console.log(json);
      this.router.navigate(['/cuerpo'])
      Swal.fire('Nueva CitaMedica',`La citaMedica número: ${json.cit_codigo} del usuario: ${json.usuario.personal.per_nombre}
      ha sido creado con exito`,'success');
    },
      err =>{
        this.errores = err.error.errors as string[];
        console.error('Código del error desde el backend' + err.status);
        console.error(err.error.errors);
      }
    )
  }

  cargarCitaMedicas(): void{

    this.activatedRoute.params.subscribe(
      /*recibe como argumento parametros*/
      params => {
    
        let codigo = params['id']
        
   
        
        //si existe el id
        if(codigo){
          this.editar=true;
          console.log("CODIGO PARAM");
          this.historiaService.getHistoria(codigo).subscribe(
            historia => {
              this.historia = historia;
              console.log(historia.his_estado);
              console.log("%%%%%%%%%")
            }
          )
        }
      })  

  }

  update():void{
    
    this.citaMedicaService.update(this.citaMedica)
        /*dentro de subscribe, se registra el observador, que seria la respuesta en este caso el cliente*/
    .subscribe(json => {
      this.router.navigate(['/cita-medica'])
      /*alerta.(titulo - el mensaje, con comillas de interpolacion (``) para poder concatenar
    con una variable- creado con éxito - el tipo de mensaje)*/
      Swal.fire('Nuevo Cita',`${json.mensaje}: ${json.citaPaciente.cit_codigo}`,'success')
    },
    /*(referente a validacion del backend)como segundo parametro, seria cuando sale mal la operacion.
     err, parametro que se estaria recibiendo por argumento; asi como arriba se recibe al cliente cuando
     todo sale bien.*/
      err =>{
        /*error, atributo del objeto error(err) que contiene el json; y en el json pasamos los errores
        dentro del parametro errors, como viene any se convierte a un string[]*/
        this.errores = err.error.errors as string[];
        console.error('Código del error desde el backend'+ err.status);
        console.error(err.error.errors);
        
      }

    )
  }

  compararCitaMedica(p1: CitaMedica, p2:CitaMedica): boolean{
    if(p1 == undefined && p2 == undefined){
      return true;
    }
    return p1==null || p2==null || p1== undefined || p2== undefined ? false: p1.cit_codigo == p2.cit_codigo;
  }

}