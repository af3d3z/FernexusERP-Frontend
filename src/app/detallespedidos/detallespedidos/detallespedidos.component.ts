import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidosService } from '../../../services/pedidos/pedidos.service';
import { Pedido } from '../../../interfaces/entidades';
import { ActivatedRoute } from '@angular/router';
import {Subscription} from 'rxjs';
import {AppMenuComponent} from '../../app-menu/app-menu.component';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, AppMenuComponent],
  templateUrl: './detallespedidos.component.html',
  styleUrls: ['./detallespedidos.component.scss'],
})
export class DetallespedidosComponent implements OnInit, OnDestroy {
  pedido: Pedido = {} as Pedido; // objeto vacio
  routeSub: Subscription = {} as Subscription; // type Subscription for cleanup

  constructor(
    private route: ActivatedRoute,
    private pedidosService: PedidosService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      const id = +params['id']; // Convert to number (if it's a string)
      if (!isNaN(id)) {
        this.obtenerPedido(id);
      } else {
        console.error('Invalid id in route parameters.');
      }
    });
  }

  obtenerPedido(id: number): void {
    this.pedidosService.getPedidoPorId(id).subscribe({
      next: (pedido: Pedido) => {
        this.pedido = pedido;
      },
      error: (error) => {
        console.error('Error al obtener el pedido:', error);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe(); // Proper cleanup of subscription
    }
  }
}
