import { Component, OnInit } from '@angular/core';
import { Personal } from '../personal';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Usuario } from './usuario';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  personal:Personal;
  usuario:Usuario;

  ver:boolean;
  titulo: string = 'Por favor Sign In!';

  constructor(private authService: AuthService, private router: Router) { 
    this.personal= new Personal();
    this.usuario = new Usuario();
  }

  ngOnInit() {

    if(this.authService.isAuthenticated()){
      /*this.authService.usuario, accediendo al al metodo getter usuario */
      Swal.fire('Login', `Hola ${this.authService.personal.username} ya estás autenticado!`,'info');
      this.router.navigate(['/cuerpo']);
    }
  }

  login():void{
    console.log(this.personal);
    if(this.personal.username == null || this.personal.password == null){
      Swal.fire('Error Login', 'Username o password vacías!','error');
      return;
    }

    /*como todo observable(el metodo login de auth.service es un Observable) se tiene
    que suscribir un observador que va realizar alguna tarea, alguna implementacion
    para manejar la respuesta del token*/
    this.authService.login(this.personal).subscribe(response => {

      console.log(response);
      /*para acceder al username se tiene que decodificar el string del payload que esta
      encriptado en base64, luego convertir a los datos, para ello se utiliza la funcion
      de javascript atob() que sera del tipo string. Para convertirlo a un objeto JSON
      se tiene que parsear ese string y convertirlo a un JSON*/
      let objetoPayload = JSON.parse(atob(response.access_token.split(".")[1]));
      console.log("PLAYLOADDDDD")
      console.log(objetoPayload);

      /*guardar los datos del usuario, y el token en el sessionStorage*/
      this.authService.guardarPersonal(response.access_token);
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);

      /*utilizando el metodo getter de usuario, aca lo ve como si fuera un siempre atributo */
      let personal = this.authService.personal;
      

      this.router.navigate(['/cuerpo']);

      Swal.fire('Login', `Hola ${personal.username}, has iniciado sesión con éxito!`,'success');
    }, error =>{
      if(error.status == 400){
        Swal.fire('Error Login', 'Usuario o clave incorrecta!','error');
      }
    })
  }

}
