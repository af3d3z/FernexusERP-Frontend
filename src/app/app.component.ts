import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FormularioLoginComponent} from './login/formulario-login/formulario-login.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormularioLoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FernexusERP_Front';
}
