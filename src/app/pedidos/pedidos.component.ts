import { Component } from '@angular/core';
import {AppMenuComponent} from '../app-menu/app-menu.component';
import {CurrencyPipe, NgClass, NgFor} from '@angular/common';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [NgFor, AppMenuComponent, CurrencyPipe, NgClass],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.scss'
})
export class PedidosComponent {
  botonColor: string = '#011640';

  pedidos = [
    { proveedor: 'Proveedor A', producto: 'Producto X', cantidad: 100, precio: 15.00, fechaPedido: '2025-03-01', estado: 'Pendiente' },
    { proveedor: 'Proveedor B', producto: 'Producto Y', cantidad: 50, precio: 25.00, fechaPedido: '2025-03-02', estado: 'Completado' },
    { proveedor: 'Proveedor C', producto: 'Producto Z', cantidad: 200, precio: 10.00, fechaPedido: '2025-03-03', estado: 'Cancelado' }
  ];

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'Pendiente': return 'badge bg-info text-dark';
      case 'Completado': return 'badge bg-success';
      case 'Cancelado': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  agregarPedido() {
    console.log("Agregar nuevo pedido");
    // TODO: modal para formulario o pagina nueva
  }
}
