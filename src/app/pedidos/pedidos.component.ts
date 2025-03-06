import { Component, OnInit } from '@angular/core';
import { AppMenuComponent } from '../app-menu/app-menu.component';
import { CurrencyPipe, NgClass, NgFor } from '@angular/common';
import { Pedido } from '../../interfaces/entidades';
import { PedidosService } from '../../services/pedidos/pedidos.service';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [NgFor, AppMenuComponent, CurrencyPipe],  // Asegurarse de incluir HttpClientModule aquí
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']  // Corregir a styleUrls
})
export class PedidosComponent implements OnInit {
  botonColor: string = '#011640';
  pedidos: Pedido[] = [];

  constructor(private pedidosService: PedidosService) {}

  async getPedidos() {
    this.pedidosService.get().subscribe({
      next: (response) => {
        this.pedidos = response;
      },
      error: (error) => {
        alert("No se han podido rescatar los datos: " + error.toString());
      }
    });
  }

  agregarPedido() {
    console.log("Agregar nuevo pedido");
    // TODO: modal para formulario o página nueva
  }

  consultarDetalles(pedido: Pedido) {
    // TODO: modal para mostrar los detalles
  }

  editarPedido(pedido: Pedido) {
    // TODO: modal para editar el pedido seleccionado
  }

  borrarPedido(pedido: Pedido) {
    // TODO: modal para borrar el pedido seleccionado
  }

  ngOnInit(): void {
    this.getPedidos();
  }

  cerrarModalBorrado() {

  }
}
