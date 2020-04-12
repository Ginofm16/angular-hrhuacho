import { Component, OnInit } from '@angular/core';
import { AuthService } from '../personal/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.css']
})
export class CabeceraComponent {

  title:string = 'App Angular';

  
  constructor(private authService:AuthService, private router: Router) { 

  }

  logout(): void{
    let username = this.authService.personal.username;
    this.authService.logout();
    Swal.fire('Logout', `Hola ${username}, has cerrado sesión con éxito!`,'success');
    
    this.router.navigate(['/login']);
  }
  

}
