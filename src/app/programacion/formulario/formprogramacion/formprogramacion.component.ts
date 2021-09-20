import { Consultorio } from 'src/app/consultorio/consultorio';
import { ProgramacionService } from './../../programacion.service';
import { AuthService } from 'src/app/personal/auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Programacion } from '../../programacion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formprogramacion',
  templateUrl: './formprogramacion.component.html',
  styleUrls: ['./formprogramacion.component.css']
})
export class FormprogramacionComponent implements OnInit {

  private programacion:Programacion = new Programacion();
  private errores: string[];
  private editar: boolean=false;
  consultorios: Consultorio[];
  private titulo: string = "Crear Programación";

  estados = [
    {valor:false, muestraValor:'Inactivo'},
    {valor:true, muestraValor:'Activo'}
  ];

  constructor(private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private programacionService: ProgramacionService) { }

  ngOnInit() {
    console.log("ngOnInit::::usuario:::"+this.authService.usuario.usu_codigo);
    this.cargarProgramacion();
    this.programacionService.getConsultorios().subscribe(consultorios => this.consultorios = consultorios);

  }

  create(): void{

    this.programacion.pro_estado = true;
    this.programacion.usuario.usu_codigo = this.authService.usuario.usu_codigo;

    this.programacionService.create(this.programacion)
    .subscribe(programacion => {
      this.router.navigate(['/mantenimiento'])
      Swal.fire('Nueva Programacion',`La programacion de código: ${programacion.pro_codigo} de fecha: ${programacion.pro_fecha}
      ha sido creado con exito`,'success');
    },
      err =>{
        this.errores = err.error.errors as string[];
        console.error('Código del error desde el backend' + err.status);
        console.error(err.error.errors);
      }
    )
  }

  cargarProgramacion(): void{

    this.activatedRoute.params.subscribe(
      params => {
    
        let codigo = params['codigo']

        console.log("CargarProgramacion-Codigo:::::")
        console.log(codigo)
        
        //si existe el id
        if(codigo){
          this.editar=true;

          this.programacionService.getProgramacion(codigo).subscribe(
            programacion => {
              this.programacion = programacion;
              console.log(programacion.pro_estado);
            }
          )
        }
      })  
  }

  update():void{
    
    this.programacionService.update(this.programacion)
    
    /*dentro de subscribe, se registra el observador, que seria la respuesta en este caso el cliente*/
    .subscribe(json => {
      this.router.navigate(['/programacion/mantenimiento'])
      console.log("UPDATE");
      console.log(json);
      console.log("UPDATE");
      /*alerta.(titulo - el mensaje, con comillas de interpolacion (``) para poder concatenar
    con una variable- creado con éxito - el tipo de mensaje)*/
      Swal.fire('Nueva Programacion',`${json.mensaje}: ${json.programacion.pro_fecha}`,'success')
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

  onSelect(code: any): void {
    console.log(":::::onSelect::::::");
    let consultorio = code.target.value;
    console.log("::::-"+consultorio+"-:::::");
  }

  compararConsultorio(p1: Consultorio, p2:Consultorio): boolean{
    if(p1 == undefined && p2 == undefined){
      return true;
    }
    return p1==null || p2==null || p1== undefined || p2== undefined ? false: p1.con_codigo == p2.con_codigo;
  }

}
