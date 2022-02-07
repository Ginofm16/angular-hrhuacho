import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalCrearcitaService {

  
  modal: boolean = false;

  /*atributo _notificarUpload, de tipo EventEmitter<any>.
  Este atributo podria ser publico para acceder a ello desde cualquier parte
  o hacerlo privado y acceder a ello desde un metodo get*/
  private _notificarRegistro = new EventEmitter<any>();

  constructor() { }

  /*metodo get en typeScript, que va retornar un EventEmitter<> de tipo <any> */
  get notificarRegistro(): EventEmitter<any>{
    return this._notificarRegistro;
  }

  abrirModal(){
    console.log("ABRIR MODAL CREAR")
    this.modal = true;
  }

  cerrarModal(){
    this.modal = false;
  }
}
