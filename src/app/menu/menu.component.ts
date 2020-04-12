import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../personal/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {

  constructor(private authService: AuthService ) {}

 

  ngOnInit() {
    
  }


}
