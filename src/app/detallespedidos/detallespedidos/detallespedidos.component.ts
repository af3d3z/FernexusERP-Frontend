import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidosService } from '../../../services/pedidos/pedidos.service';
import { Pedido } from '../../../interfaces/entidades';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detallespedidos.component.html',
  styleUrls: ['./detallespedidos.component.scss'],
})
export class DetallespedidosComponent implements OnInit {
  pedido: Pedido = {} as Pedido; // objeto vacio
//  { path: ' { path: 'detalles/:id', component: DetallespedidosComponent, canActivate: [authGuardGuard]}, hace falta crear la navegacion a la pagina debe pasar el id por parametro en app routes
  constructor( private pedidosService: PedidosService) {}

  ngOnInit(): void {
    this.obtenerPedido(4); // 4 es un id de ejemplo tiene que recibir un id por parametro
  }

  obtenerPedido(id: number): void {
    this.pedidosService.getPedidoPorId(id).subscribe({ //llanada a la api
      next: (pedido: Pedido) => {
        this.pedido = pedido;
      },
      error: (error) => {
        console.error('Error al obtener el pedido:', error); // salta cundo hay un error en la api si no sale o no existe el id o tarda mucho en responder
      }
    });
  }
  /**hace falta esto en services no teneis ningun metodo para pedir un producto solo en la api si existe  getPedidoPorId(idProducto: number): Observable<Pedido> {
      return this.http.get<Pedido>(`https://fernexus-api.azurewebsites.net/api/Pedido/${4}`);
    } */
}