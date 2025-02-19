import { Routes } from '@angular/router';
import {FormularioLoginComponent} from './login/formulario-login/formulario-login.component';
import {PedidosComponent} from './pedidos/pedidos.component';
import {WipComponent} from './wip/wip.component';

export const routes: Routes = [
  { path: 'login', component: FormularioLoginComponent },
  { path: 'pedidos', component: PedidosComponent },
  { path: 'wip', component: WipComponent },
];
