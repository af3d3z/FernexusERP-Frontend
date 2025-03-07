import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AppMenuComponent } from '../app-menu/app-menu.component';
import { CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Pedido } from '../../interfaces/entidades';
import { PedidosService } from '../../services/pedidos/pedidos.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [NgFor, AppMenuComponent, CurrencyPipe, NgIf],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {
  botonColor: string = '#011640';
  @ViewChild('borrarModal') modal!: ElementRef;
  pedidos: Pedido[] = [];
  nPedidoSeleccionado = 0;
  cargando: boolean = true; // Variable para controlar el estado de carga

  constructor(private pedidosService: PedidosService, private renderer: Renderer2) {}

  async getPedidos() {
    this.pedidosService.get().subscribe({
      next: (response) => {
        this.pedidos = response;
        this.cargando = false;
      },
      error: (error) => {
        alert("No se han podido rescatar los datos: " + error.message);
        this.cargando = false;
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

  borrarPedido(nPedido: number) {
    if (nPedido > 0) {
      this.pedidosService.delete(nPedido).subscribe({
        next: (response) => {
          console.log(response)
          if(response == "Pedido eliminado correctamente"){
            swal("Borrado", "Se ha eliminado correctamente", "success");
          }
        },
        error: (error) => {
          swal("Borrado", "Se ha eliminado correctamente", "error");
        }
      })
    }
    this.pedidos = this.pedidos.filter(pedido => pedido.idPedido != this.nPedidoSeleccionado);
    this.cerrarModalDelete();
  }

  abrirModalDelete(pedido: Pedido) {
    this.nPedidoSeleccionado = pedido.idPedido;
    this.renderer.addClass(this.modal.nativeElement, 'show');
    this.renderer.setStyle(this.modal.nativeElement, 'display', 'block');
  }

  cerrarModalDelete() {
    this.nPedidoSeleccionado = 0;
    this.renderer.removeClass(this.modal.nativeElement, 'show');
    this.renderer.setStyle(this.modal.nativeElement, 'display', 'none');
  }

  ngOnInit(): void {
    this.getPedidos().then(r => {console.log("Cargando...")});
  }
}
