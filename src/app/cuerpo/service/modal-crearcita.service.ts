import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalCrearcitaService {

  
  modal: boolean = false;

  /*atributo _notificarUpload, de tipo EventEmitter<any>.
  Este atributo podria ser publico para acceder a ello desde cualquier parte
  o hacerlo privado y acceder a ello desde un metodo get*/
  private _notificarUpload = new EventEmitter<any>();

  constructor() { }

  /*metodo get en typeScript, que va retornar un EventEmitter<> de tipo <any> */
  get notificarUpload(): EventEmitter<any>{
    return this._notificarUpload;
  }

  abrirModal(){
    console.log("ABRIR MODAL CREAR")
    this.modal = true;
  }

  cerrarModal(){
    this.modal = false;
  }
}
