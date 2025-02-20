import { Component } from '@angular/core';
import {AppMenuComponent} from '../app-menu/app-menu.component';

@Component({
  selector: 'app-mainpage',
  imports: [
    AppMenuComponent
  ],
  templateUrl: './mainpage.component.html',
  styleUrl: './mainpage.component.scss'
})
export class MainpageComponent {

}
