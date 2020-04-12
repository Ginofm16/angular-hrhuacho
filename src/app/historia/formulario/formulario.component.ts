import { Component, OnInit } from '@angular/core';
import { Historia } from '../historia';
import { HistoriaService } from '../historia.service';
import { Pais } from '../pais';

import {Router, ActivatedRoute } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  private historia:Historia = new Historia();
  private newHistoria: Historia;
  private titulo: string = "Crear Historia";
  private editar: boolean=false;

  private errores: string[];
  paises: Pais[];
  paisSeleccionado: Pais[];

  constructor(private historiaService: HistoriaService,
              private router:Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.cargarHistoria();
    this.historiaService.getPaises().subscribe(paises => this.paises = paises);

  }

  seguros = [
    {valor:'sis', muestraValor:'SIS'},
    {valor:'particular', muestraValor:'Particular'}
  ];

  generos = [
    {valor:'m', muestraValor:'Masculino'},
    {valor:'f', muestraValor:'Femenino'}
  ];

  estados = [
    {valor:false, muestraValor:'Inactivo'},
    {valor:true, muestraValor:'Activo'}
  ];

  gEstudios = [
    {valor:'ninguna', muestraValor:'Ninguna'},
    {valor:'primaria', muestraValor:'Primaria'},
    {valor:'secundaria', muestraValor:'Secundaria'},
    {valor:'tecnica', muestraValor:'Técnica'},
    {valor:'universitaria', muestraValor:'Universitaria'}
  ];

  create(): void{

    this.historia.his_estado = true;

    this.historiaService.create(this.historia)
    .subscribe(historia => {
      this.router.navigate(['/historias'])
      Swal.fire('Nueva Historia',`La historia número: ${historia.his_codigo} del usuario: ${historia.his_nombre}
      ha sido creado con exito`,'success');
    },
      err =>{
        this.errores = err.error.errors as string[];
        console.error('Código del error desde el backend' + err.status);
        console.error(err.error.errors);
      }
    )
  }

  /*Metodo para el UPDATE. metodo void, porque solo asiganra la respuesta al Atributo
  de cliente*/
  cargarHistoria(): void{

    /*vamos a subscribir a un obervador, que va estar obervando cuando se obtenga el id,
    cuando se le pase por parametro, parametro que esta en el enlace de la url*/
    this.activatedRoute.params.subscribe(
      /*recibe como argumento parametros*/
      params => {
    
        let codigo = params['codigo']

        console.log(codigo)
        
        //si existe el id
        if(codigo){
          this.editar=true;

          /*tambien subscribimos para registrar el observador q asigna el cliente obtenido de
          la consulta getCliente(), al atributo de la variable cliente*/
          this.historiaService.getHistoria(codigo).subscribe(
            historia => {
              this.historia = historia;
              console.log(historia.his_estado);
            }
          )

        }
        
      })  

  }

  update():void{
    this.historiaService.update(this.historia)
    /*dentro de subscribe, se registra el observador, que seria la respuesta en este caso el cliente*/
    .subscribe(json => {
      this.router.navigate(['/historias'])
      /*alerta.(titulo - el mensaje, con comillas de interpolacion (``) para poder concatenar
    con una variable- creado con éxito - el tipo de mensaje)*/
      Swal.fire('Nuevo Historia',`${json.mensaje}: ${json.historia.his_nombre}`,'success')
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

  compararPais(p1: Pais, p2:Pais): boolean{
    if(p1 == undefined && p2 == undefined){
      return true;
    }
    return p1==null || p2==null || p1== undefined || p2== undefined ? false: p1.pais_codigo == p2.pais_codigo;
  }


}
