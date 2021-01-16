import { CitaMedicaService } from './service/cita-medica.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from '../personal/auth.service';
import { CitaMedica } from './cita-medica';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cita-medica',
  templateUrl: './cita-medica.component.html'
})
export class CitaMedicaComponent implements OnInit {

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>();

  contador:number=0;
  citaMedicas: CitaMedica[];
  private errores: string[];
  citaMedicaIndex: CitaMedica[];

  constructor(private authService: AuthService,
    private citaMedicaService: CitaMedicaService,
    private zone: NgZone,
    private router: Router) { }

  ngOnInit() {
    console.log("****")
    console.log(this.authService.usuario);
    this.citaMedicaService.getCitaMedicaIndex().subscribe(citaMedica => {
      this.citaMedicaIndex = citaMedica;
      // Calling the DT trigger to manually render the table
      this.dtTrigger.next();
  });

  //solo cuando se hace next()
  this.citaMedicaService.citaMedicaCambio.subscribe(data => {
    this.citaMedicaIndex = data;
  });
  

  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  reloadPage() { //click handler or similar
    this.zone.runOutsideAngular(() => {
      location.reload();
      this.contador = this.contador + 1;
    });
  }

  delete(citaMedica: CitaMedica): void {
    /*agregaremos un swin para confirmar si se quiere eliminar*/
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    })

    swalWithBootstrapButtons.fire({
      title: 'Eliminar Historia',
      text: `¿Estas seguro de eliminar la cita ${citaMedica.cit_codigo}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.citaMedicaService.delete(citaMedica.cit_codigo).subscribe(
          /*como respuesta se manda el mensaje*/
          response => {

            /*una ves eliminado la historia, q se actualice el listado de historia.
            filter, metodo que permite filtrar solo los elemenos que deseamos y los devuelve en un array;
            hara que no muestre el cliente que acabamos de eliminar. (clie =>) es el que tiene a los clientes
            y (> cli) los ira recibiendo cada cliente y pregunta si es distinto al cliente que se va eliminar,
            si es distinto lo va mostrar*/
            this.citaMedicas = this.citaMedicas.filter(cita => cita !== citaMedica)

            swalWithBootstrapButtons.fire(
              'Cita eliminada!',
              `Cita ${citaMedica.cit_codigo} eliminado con exito`,
              'success'
            )
          }
        )
      }
    });
  }

  deleteLogico(citaMedica: CitaMedica):void{
    citaMedica.cit_estado = false;
    this.citaMedicaService.update(citaMedica)

    .subscribe(json => {
      this.router.navigate(['/cita-medica'])
      Swal.fire('Cita Inactivo',`${json.mensaje}: ${json.citaMedica.cit_codigo}`,'success')
      this.citaMedicaService.getCitaMedicaIndex().subscribe(data => {
        this.citaMedicaService.citaMedicaCambio.next(data);
      })
    },
      err =>{
        this.errores = err.error.errors as string[];
        console.error('Código del error desde el backend'+ err.status);
        console.error(err.error.errors);
      }
    )
  }



}
