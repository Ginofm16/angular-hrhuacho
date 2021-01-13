import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { Historia } from './historia';
import { HistoriaService} from './historia.service';
import { ModalService} from './detalle/modal.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../personal/auth.service';
import { MenuComponent } from '../menu/menu.component';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-historias',
  templateUrl: './historias.component.html'
})
export class HistoriasComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  historias: Historia[];
  historiasIndex: Historia[];

  paginador: any;
  historiaSeleccionada: Historia;
  private errores: string[];
  ver:boolean;
  menu: MenuComponent;
  contador:number=0;

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private historiaService: HistoriaService,
    private modalService: ModalService,
    private authService: AuthService,
    private router: Router,
              private activatedRoute: ActivatedRoute,
              private zone: NgZone) { }
 
  ngOnInit() {

    this.historiaService.getHistoriasIndex().subscribe(historia => {
        this.historiasIndex = historia;
        // Calling the DT trigger to manually render the table
        this.dtTrigger.next();
    });

    //solo cuando se hace next()
    this.historiaService.historiaCambio.subscribe(data => {
      this.historiasIndex = data;
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
      Swal.fire('Historia Inactivo',`${json.mensaje}: ${json.historia.his_nombre}`,'success')
      this.historiaService.getHistoriasIndex().subscribe(data => {
        this.historiaService.historiaCambio.next(data);
      })
    },
      err =>{
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
