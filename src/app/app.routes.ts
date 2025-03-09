import { Routes } from '@angular/router';
import {FormularioLoginComponent} from './login/formulario-login/formulario-login.component';
import {MainpageComponent} from './mainpage/mainpage.component';
import {PedidosComponent} from './pedidos/pedidos.component';
import {WipComponent} from './wip/wip.component';
import {authGuardGuard} from './guards/auth-guard.guard';
import {DetallespedidosComponent} from './detallespedidos/detallespedidos/detallespedidos.component';

export const routes: Routes = [
  { path: 'login', component: FormularioLoginComponent },
  { path: 'pedidos', component: PedidosComponent, canActivate: [authGuardGuard] },
  { path: 'detalles/:id', component: DetallespedidosComponent, canActivate: [authGuardGuard]},
  { path: 'wip', component: WipComponent, canActivate: [authGuardGuard] },
  { path: 'main', component: MainpageComponent, canActivate: [authGuardGuard]},
  { path: '**', redirectTo: 'login' }
];
