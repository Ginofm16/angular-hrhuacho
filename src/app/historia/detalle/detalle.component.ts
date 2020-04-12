import { Component, OnInit, Input } from '@angular/core';
import { Historia } from '../historia';
import { HistoriaService } from '../historia.service';
import { ModalService} from './modal.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { HttpEventType } from '@angular/common/http';
import { Cuerpo } from 'src/app/cuerpo/cuerpo';

@Component({
  selector: 'detalle-historia',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() historia: Historia;

  titulo: string = "Detalle de Historia";
  private imagenSeleccionada: File;
   progreso:number = 0;

  createdAtCovert: any;
  public date: any;


  /*se inyecta el clienteService. 
  AL inyectar el ModalService, va permitir cerrar el modal bootstrap, porque el service esta conteniendo
  un atributo boolean de valor false*/
  constructor(private clienteService: HistoriaService,
    private modalService: ModalService) { }

  ngOnInit() {
  }

  cerrarModal(){
    this.modalService.cerrarModal();
  }

}
