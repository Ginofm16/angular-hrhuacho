import { Component } from '@angular/core';
import { AuthService } from './personal/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import dayGridPlugin from '@fullcalendar/daygrid';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  calendarPlugins = [dayGridPlugin];

  constructor(private authService:AuthService, private router: Router) { }

  logout(): void{
    let username = this.authService.personal.username;
    this.authService.logout();
    Swal.fire('Logout', `Hola ${username}, has cerrado sesión con éxito!`,'success');
    
    this.router.navigate(['/login']);
  }
  title = 'hospital-app';

}
