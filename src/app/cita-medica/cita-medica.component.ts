import { Component, OnInit } from '@angular/core';
import { AuthService } from '../personal/auth.service';

@Component({
  selector: 'app-cita-medica',
  templateUrl: './cita-medica.component.html'
})
export class CitaMedicaComponent implements OnInit {

  constructor(private authService:AuthService) { }

  ngOnInit() {
    console.log("****")
    console.log(this.authService.usuario);
  }

}
