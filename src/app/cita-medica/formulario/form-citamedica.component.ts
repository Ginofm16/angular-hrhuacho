import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/personal/auth.service';

@Component({
  selector: 'app-form-citamedica',
  templateUrl: './form-citamedica.component.html',
  styleUrls: ['./form-citamedica.component.css']
})
export class FormCitamedicaComponent implements OnInit {

  constructor(private authService:AuthService) { }

  ngOnInit() {
    console.log("****")
    console.log(this.authService.usuario);
  }

}
