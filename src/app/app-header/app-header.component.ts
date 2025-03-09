import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './app-header.component.html',
  standalone: true,
  styleUrl: './app-header.component.scss'
})
export class AppHeaderComponent {
  constructor(private router: Router) {}

  redirigirMain(){
    this.router.navigate(['/']);
  }
}
