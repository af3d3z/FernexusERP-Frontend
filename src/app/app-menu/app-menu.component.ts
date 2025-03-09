import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './app-menu.component.html',
  imports: [
    RouterLink,
    RouterLinkActive,
  ],
  standalone: true,
  styleUrl: './app-menu.component.scss'
})
export class AppMenuComponent {

}
