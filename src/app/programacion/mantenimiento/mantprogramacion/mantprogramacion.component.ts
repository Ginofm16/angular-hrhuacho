import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Consultorio } from 'src/app/calendar/consultorio';
import { ProgramacionService } from '../../programacion.service';
import { Programacion } from '../../programacion';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { tap, map } from 'rxjs/operators';
import { AuthService } from 'src/app/personal/auth.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-mantprogramacion',
  templateUrl: './mantprogramacion.component.html'
})
export class MantprogramacionComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  codConsultorio: String;
  horarioFrecuencia: String;
  programaciones: Programacion[];
  programacion: Programacion;
  private programacionDelete:Programacion = new Programacion();
  private errores: string[];


  prograList: Array<Programacion> = [];

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private programacionService: ProgramacionService, private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService) { }



  ngOnInit() {

    this.codConsultorio = this.programacionService.codConsultorio;


    this.programacionService.getProgramacionesIndex().subscribe(programaciones => {


      (programaciones as Programacion[]).forEach(element => {
        console.log(parseInt(element.pro_hora_inicio.substring(0, 2)));

        if (element.pro_hora_inicio >= '12:00' ) {
          if (element.pro_hora_inicio >= '01:00' ) {
            if (element.pro_hora_inicio < '20:00') {
              let hora = '0' + (parseInt(element.pro_hora_inicio.substring(0, 2)) - 12) + ':' + element.pro_hora_inicio.substring(3) + ' PM';
              element.pro_hora_inicio = hora;
            }else{
              let hora = (parseInt(element.pro_hora_inicio.substring(0, 2)) - 12) + ':' + element.pro_hora_inicio.substring(3) + ' PM';
              element.pro_hora_inicio = hora;
            }
          }else{
            let hora = (parseInt(element.pro_hora_inicio.substring(0, 2)) - 12) + ':' + element.pro_hora_inicio.substring(3) + ' PM';
            element.pro_hora_inicio = hora;
          }

        } else {
          let hora = element.pro_hora_inicio + ' AM';
          element.pro_hora_inicio = hora;
        }

        this.prograList.push(element);

      });
    
      this.programaciones = this.prograList;
    
      this.dtTrigger.next();
    });

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5
    };

  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
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

  deleteLogico(programacion: Programacion): void {
    programacion.pro_estado = false;
    this.programacionDelete.pro_codigo = programacion.pro_codigo;
    this.programacionDelete.pro_estado = programacion.pro_estado;
    this.programacionDelete.pro_fecha = programacion.pro_fecha;
    
    this.programacionService.update(programacion)
      /*dentro de subscribe, se registra el observador, que seria la respuesta*/
      .subscribe(json => {
        this.router.navigate(['/programacion/mantenimiento'])
        /*alerta.(titulo - el mensaje, con comillas de interpolacion (``) para poder concatenar
      con una variable- creado con éxito - el tipo de mensaje)*/
        Swal.fire('Programación Inactivo', `${json.mensaje}: ${json.programacion.pro_codigo}`, 'success')
      },
        /*(referente a validacion del backend)como segundo parametro, seria cuando sale mal la operacion.
         err, parametro que se estaria recibiendo por argumento; asi como arriba se recibe al cliente cuando
         todo sale bien.*/
        err => {
          /*error, atributo del objeto error(err) que contiene el json; y en el json pasamos los errores
          dentro del parametro errors, como viene any se convierte a un string[]*/
          this.errores = err.error.errors as string[];
          console.error('Código del error desde el backend' + err.status);
          console.error(err.error.errors);

        }

      )
  }



}
