import { Categoria } from './../../categoria';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pais } from 'src/app/pais/pais';
import Swal from 'sweetalert2';
import { Especialidad } from '../../especialidad';
import { Personal } from '../../personal';
import { PersonalService } from '../../personal.service';
import { TipoDocumento } from '../../../tipo-documento/tipoDocumento';

@Component({
  selector: 'app-formulariopersonal',
  templateUrl: './formulariopersonal.component.html',
  styleUrls: ['./formulariopersonal.component.css']
})
export class FormulariopersonalComponent implements OnInit {

  private personal:Personal = new Personal();
  private newPersonal: Personal;
  private titulo: string = "Crear Personal";
  private editar: boolean=false;

  private errores: string[];
  especialidades: Especialidad[];
  categorias: Categoria[];
  paises: Pais[];
  tipoDocumentos: TipoDocumento[];

  constructor(private personalService: PersonalService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarPersonal();
    this.personalService.getCategorias().subscribe(categoria => this.categorias = categoria);
    this.personalService.getEspecialidad().subscribe(especialidad => this.especialidades = especialidad);
    this.personalService.getPaises().subscribe(paises => this.paises = paises);
    this.personalService.getTipoDocumento().subscribe(tipoDocumentos => this.tipoDocumentos = tipoDocumentos);
  }

  cargarPersonal(): void{

    this.activatedRoute.params.subscribe(
      params => {
         let codigo = params['codigo']
         console.log(codigo);

         if(codigo){
           this.editar= true;

            this.personalService.getPersonal(codigo).subscribe(
              personal => {
                this.personal = personal;
                console.log(personal);
              }
            )

         }
      }
    )

  }

  create(): void{
    this.personal.per_estado = true;
    console.log("::::Create:::");
    console.log(this.personal);
    this.personalService.create(this.personal)
    .subscribe(personal => {
      this.router.navigate(['/personal'])
      Swal.fire('Nuevo Personal', `El personal con código: ${personal.per_codigo}, nombre: ${personal.per_nombre}
      ha sido creado con exito`,'success');
    },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Código del error desde el backend'+ err.status);
        console.error(err.error.errors);
      }
    )
  }

  update(): void{
    this.personalService.update(this.personal).subscribe(
      json => {
        this.router.navigate(['/personal'])

        Swal.fire('Nuevo Personal', `${json.mensaje}: ${json.personal.per_nombre}`,'success')
      },

      err => {
        this.errores = err.error.errors as string[];
        console.error('Codigo del error desde el backend'+ err.status);
        console.error(err.error.errors)
      }
    )
  }

  compararTipoDocumento(d1: TipoDocumento, d2:TipoDocumento): boolean {
    if(d1 == undefined && d2 == undefined){
      return true;
    }
    return d1==null || d2==null || d1== undefined || d2== undefined ? false: d1.doc_codigo == d2.doc_codigo; 
  }

  compararPais(p1: Pais, p2:Pais): boolean{
    if(p1 == undefined && p2 == undefined){
      return true;
    }
    return p1==null || p2==null || p1== undefined || p2== undefined ? false: p1.pais_codigo == p2.pais_codigo;
  }

  compararCategoria(c1: Categoria, c2:Categoria): boolean{
    if(c1 == undefined && c2 == undefined){
      return true;
    }
    return c1==null || c2==null || c1== undefined || c2== undefined ? false: c1.cat_estado == c2.cat_estado;
  }

  compararEspecialidad(e1: Especialidad, e2:Especialidad): boolean{
    if(e1 == undefined && e2 == undefined){
      return true;
    }
    return e1==null || e2==null || e1== undefined || e2== undefined ? false: e1.esp_estado == e2.esp_estado;
  }

}
