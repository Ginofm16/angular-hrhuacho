import { CitaMedicaService } from './../cita-medica/service/cita-medica.service';
import { ModalCrearcitaService } from './service/modal-crearcita.service';
import { Component, OnInit } from '@angular/core';
import { Historia } from '../historia/historia';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, flatMap } from 'rxjs/operators';
import { HistoriaService } from '../historia/historia.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CuerpoService } from './service/cuerpo.service';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import Swal from 'sweetalert2';
import { Cuerpo } from './cuerpo';
import { HistoriasComponent } from '../historia/historias.component';
import { ModalService } from '../historia/detalle/modal.service';


@Component({
  selector: 'app-cuerpo',
  templateUrl: './cuerpo.component.html',
  styleUrls: ['./cuerpo.component.css']
})
export class CuerpoComponent implements OnInit {

  titulo: string = 'Nuevo Paciente';
  titulo_paciente: string = 'Paciente';
  cuerpo: Cuerpo = new Cuerpo();
  historiaComp: HistoriasComponent;
  historia: Historia = new Historia();
  historiaSeleccionada: Historia;
  historiaSeleccionadaCrearCita: Historia;

  autocompleteControl = new FormControl();

  historiasFiltradas: Observable<Historia[]>;

  constructor(private cuerpoService: CuerpoService,
              private router: Router,
              private modalService: ModalService,
              private modalCrearcitaService: ModalCrearcitaService,
              private activatedRoute: ActivatedRoute,
              private serviceCitaMedica: CitaMedicaService) {
                console.log('::::constructor CuerpoComponent:::');
    
               }

  ngOnInit() {
    console.log('::::ngOnInit CuerpoComponent:::');
    this.cuerpo.items = [];

    this.historiasFiltradas = this.autocompleteControl.valueChanges
      .pipe(
        /*se usara map, porque el valor no es solo el string, sino tambien el objeto producto que 
        contiene el nombre*/
        map(value => typeof value === 'string' ? value : value.his_ape_paterno),
        /*faltMap, va "aplanar" los valores de un observable dentro de otro observable .
        Podemos una condicional, donde si existe el valor(que no sea null o indefinido)
        se retorna los valores filtrados, sino un array vacio*/
        flatMap(value => value ? this._filter(value) : [])
      );

      this.modalCrearcitaService.notificarRegistro.subscribe(citaMedica => {
        this.cuerpo.items = [];
      })

  }

  private _filter(value: string): Observable<Historia[]> {
    const filterValue = value.toLowerCase();
    /*.includes(filterValue), aca se compara el valor ingresado con las lista de productos*/
    return this.cuerpoService.filtrarHistorias(filterValue);
  }
  /*Va tener un argumentp opcional porque al principio mientras no se selecciona ningun producto,
  no va mostrar nada , un valor vacio.
  producto?: Producto, se indica que de parametro sera opcional, puede haber o no el
  parametro Producto. Va retornar un string o tambien un indefinido*/
  mostrarNombre(historia?: Historia): string | undefined {
    return historia ? historia.his_ape_paterno: undefined;
  }

  seleccionarHistoria(event: MatAutocompleteSelectedEvent): void {
    let nuevoItem = new Historia();
     nuevoItem = event.option.value as Historia;

    if (this.existeItem(nuevoItem.his_codigo)) {
      Swal.fire(this.titulo_paciente, `Usuario ${nuevoItem.his_ape_paterno} ya fue encontrado`, 'info');
    } else {
      console.log('nuevoItemsssss');
      
     
      this.cuerpo.items.push(nuevoItem);

      console.log(this.cuerpo.items)
    }

    /*para buscar otro producto y agregar otra linea se tiene que limpiar el autocomplete*/
    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();

  }

  existeItem(id: number): boolean {
    let existe = false;
    this.cuerpo.items.forEach((item: Historia) => {
      if (id === item.his_codigo) {
        existe = true;
      }
    });
    return existe;

  }

  eliminarItemHistoria(id: number): void {
    /*actualizar la lista con ese item menos, se tiene que filtrar y eliminar; por lo tanto
    se va filtrar colocando todos los items en la factura distinto a ese id.
    Filtrar todo los productos cuanp el id del argumento sea distinto al id del producto */
    this.cuerpo.items = this.cuerpo.items.filter((item: Historia) =>
      id !== item.his_codigo);
  }

  abrirModal(historia: Historia){
    this.historiaSeleccionada = historia;
    this.modalService.abrirModal();
  }

  abrirModalCrear(historia: Historia){
    
    this.historiaSeleccionadaCrearCita = historia;
    this.modalCrearcitaService.abrirModal();
  }

  descargarReporte(){
    this.serviceCitaMedica.generarReporte().subscribe(data =>{
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
