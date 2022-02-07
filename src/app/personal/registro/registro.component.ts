import { UsuarioRegistro } from './../usuarioRegistro';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Personal } from '../personal';
import { PersonalService } from '../personal.service';
import { RespuestaValidacion } from './respuestaValidacion';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  @ViewChild('editForm', {
    static: false
  }) editForm: NgForm;

  usuario_registro: UsuarioRegistro = new UsuarioRegistro();
  personal: Personal;
  resultFindCorreo : RespuestaValidacion = new RespuestaValidacion();
  resultFindUsuario: RespuestaValidacion = new RespuestaValidacion();
  resultFind: RespuestaValidacion;
  private errores: string[];
  equalPassword: boolean= true;
  constructor(private personalService: PersonalService,
    private router: Router) { }

  ngOnInit() {
  }

  registro(): void{
    console.log(":::::::login():::::")
    console.log(":::::::getPersonalByCorreo():::::")
      this.personalService.getPersonalByCorreo(this.usuario_registro.correo).subscribe(data => {
          this.resultFindCorreo = data;
      },
      err => {
        console.log("::::::::::::::ERR:::::::::::")
        console.log(err)
        console.log(err.status);
        console.log(err.error.result);
        console.log("*************")
      })
    
      this.personalService.getPersonalByUsuario(this.usuario_registro.usuario).subscribe(data => {
        this.resultFindUsuario = data as RespuestaValidacion;
        console.log(this.resultFindUsuario);
      },
        err => {
        console.log("::::::::::::::ERR:::::::::::")
        console.log(err)
        console.log(err.status);
        console.log(err.error.result);
        console.log("*************")
      })
    

    if(this.usuario_registro.password !=  this.usuario_registro.comfirm_password){
      Swal.fire("La contraseña de confirmación, no coincide");
    }else{

      this.personalService.updatePersonalUsuario(this.usuario_registro).subscribe( data => {

        let usuarioRegistro =  data.usuarioRegistro as UsuarioRegistro;
        console.log(usuarioRegistro.usuario);
        
        Swal.fire("Usuario "+usuarioRegistro.usuario+" fue creado. Ya puede iniciar sesion");

        this.editForm.reset();
        this.router.navigate(['/registro'])
      })
    }
    

  }


}
