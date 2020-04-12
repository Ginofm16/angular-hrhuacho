import { Component, OnInit, NgZone } from '@angular/core';
import { Historia } from './historia';
import { HistoriaService} from './historia.service';
import { ModalService} from './detalle/modal.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../personal/auth.service';
import { MenuComponent } from '../menu/menu.component';



@Component({
  selector: 'app-historias',
  templateUrl: './historias.component.html'
})
export class HistoriasComponent implements OnInit {

  historias: Historia[];

  paginador: any;
  historiaSeleccionada: Historia;
  private errores: string[];
  ver:boolean;
  menu: MenuComponent;
  contador:number=0;

  constructor(private historiaService: HistoriaService,
    private modalService: ModalService,
    private authService: AuthService,
    private router: Router,
              private activatedRoute: ActivatedRoute,
              private zone: NgZone) { }

              

  ngOnInit() {
    
    this.activatedRoute.paramMap.subscribe(params => {
      let page: number =+params.get('page');

      if(!page){
        page = 0;
      }

      this.historiaService.getHistorias(page).pipe(
        tap(response => {
          (response.content as Historia[]).forEach(historia =>
            console.log(historia.his_nombre));

        })
      ).subscribe(
        (response) => {
          this.historias = response.content as Historia[];
          this.paginador = response;
          
        }
      )
    })

  }

  reloadPage() { //click handler or similar
    this.zone.runOutsideAngular(() => {
        location.reload();
        this.contador = this.contador + 1;
    });
    }

  delete(historia: Historia): void {
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
      text: `¿Estas seguro de eliminar la historia ${historia.his_codigo} ${historia.his_nombre}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.historiaService.delete(historia.his_codigo).subscribe(
          /*como respuesta se manda el mensaje*/
          response => {

            /*una ves eliminado la historia, q se actualice el listado de historia.
            filter, metodo que permite filtrar solo los elemenos que deseamos y los devuelve en un array;
            hara que no muestre el cliente que acabamos de eliminar. (clie =>) es el que tiene a los clientes
            y (> cli) los ira recibiendo cada cliente y pregunta si es distinto al cliente que se va eliminar,
            si es distinto lo va mostrar*/
            this.historias = this.historias.filter(his => his !== historia)

            swalWithBootstrapButtons.fire(
              'Historia eliminada!',
              `Historia ${historia.his_codigo} eliminado con exito`,
              'success'
            )
          }
        )


      }
    });
  }

  deleteLogico(historia: Historia):void{
    historia.his_estado = false;
    this.historiaService.update(historia)
    /*dentro de subscribe, se registra el observador, que seria la respuesta en este caso el cliente*/
    .subscribe(json => {
      this.router.navigate(['/historias'])
      /*alerta.(titulo - el mensaje, con comillas de interpolacion (``) para poder concatenar
    con una variable- creado con éxito - el tipo de mensaje)*/
      Swal.fire('Historia Inactivo',`${json.mensaje}: ${json.historia.his_nombre}`,'success')
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

  abrirModal(historia: Historia){
    this.historiaSeleccionada = historia;
    this.modalService.abrirModal();
  }

}
