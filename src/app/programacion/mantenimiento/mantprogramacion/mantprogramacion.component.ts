import { Component, OnInit, Input } from '@angular/core';
import { Consultorio } from 'src/app/calendar/consultorio';
import { ProgramacionService } from '../../programacion.service';
import { Programacion } from '../../programacion';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/personal/auth.service';

@Component({
  selector: 'app-mantprogramacion',
  templateUrl: './mantprogramacion.component.html',
  styleUrls: ['./mantprogramacion.component.css']
})
export class MantprogramacionComponent implements OnInit {

  paginador: any;
  codConsultorio: String;
  programaciones: Programacion[];
  programacion: Programacion;
  private errores: string[];

  constructor(private programacionService: ProgramacionService, private router : Router,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit() {
    this.codConsultorio = this.programacionService.codConsultorio;
    
    this.activatedRoute.paramMap.subscribe(params => {
      let page: number =+params.get('page');

      if(!page){
        page = 0;
      }

      /*this.programacionService.getProgramacionEspecialidad(page, this.codConsultorio).pipe(
        tap(response => {
          (response.content as Programacion[]).forEach(programacion =>
            console.log(programacion.pro_fecha));

        })
      )*/
      this.programacionService.getProgramaciones(page).pipe(
        tap(response => {
          (response.content as Programacion[]).forEach(programacion =>
            console.log(programacion.pro_fecha));

        })
      )
      .subscribe(
        (response) => {
          this.programaciones = response.content as Programacion[];
          this.paginador = response;
          
        }
      )
    })
  }

  delete(programacion: Programacion): void {
    /*agregaremos un swin para confirmar si se quiere eliminar*/
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    })

    swalWithBootstrapButtons.fire({
      title: 'Eliminar programación',
      text: `¿Estas seguro de eliminar la programacion ${programacion.pro_codigo} ?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.programacionService.delete(programacion.pro_codigo).subscribe(
          /*como respuesta se manda el mensaje*/
          response => {

            this.programaciones = this.programaciones.filter(pro => pro !== programacion)

            swalWithBootstrapButtons.fire(
              'Programación eliminada!',
              `Programación ${programacion.pro_codigo} eliminado con exito`,
              'success'
            )
          }
        )


      }
    });
  }

  deleteLogico(programacion: Programacion):void{
    programacion.pro_estado = false;
    this.programacionService.update(programacion)
    /*dentro de subscribe, se registra el observador, que seria la respuesta*/
    .subscribe(json => {
      this.router.navigate(['/programacion/mantenimiento'])
      /*alerta.(titulo - el mensaje, con comillas de interpolacion (``) para poder concatenar
    con una variable- creado con éxito - el tipo de mensaje)*/
      Swal.fire('Programación Inactivo',`${json.mensaje}: ${json.programacion.pro_codigo}`,'success')
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

}
