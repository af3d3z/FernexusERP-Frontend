import { Component, OnInit } from '@angular/core';
import { AppMenuComponent } from '../app-menu/app-menu.component';
import { CurrencyPipe, NgClass, NgFor } from '@angular/common';
import { Pedido } from '../../interfaces/entidades';
import { PedidosService } from '../../services/pedidos/pedidos.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';  // Importar el HttpClientModule

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [NgFor, AppMenuComponent, CurrencyPipe, HttpClientModule],  // Asegurarse de incluir HttpClientModule aquí
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

  }

  editarPedido(pedido: Pedido) {

  }

  borrarPedido(pedido: Pedido) {

  }

  ngOnInit(): void {
    this.getPedidos();
  }
}
