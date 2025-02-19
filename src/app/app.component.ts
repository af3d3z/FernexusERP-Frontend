import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppMenuComponent } from './app-menu/app-menu.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppHeaderComponent, AppMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FernexusERP_Front';
}
