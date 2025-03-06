import { Component, OnInit } from '@angular/core';
import { AppMenuComponent } from '../app-menu/app-menu.component';
import { CurrencyPipe, NgClass, NgFor } from '@angular/common';
import { Pedido } from '../../interfaces/entidades';
import { PedidosService } from '../../services/pedidos/pedidos.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';  // Importar el HttpClientModule

declare var bootstrap: any;  // Añadir esta declaración para que TypeScript reconozca 'bootstrap'

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [NgFor, AppMenuComponent, CurrencyPipe, HttpClientModule, ReactiveFormsModule],  // Asegurarse de incluir ReactiveFormsModule
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {
  botonColor: string = '#011640';
  pedidos: Pedido[] = [];
  pedidoForm: FormGroup;

  constructor(
    private pedidosService: PedidosService,
    private fb: FormBuilder
  ) {
    this.pedidoForm = this.fb.group({
      idPedido: ['', Validators.required],
      fechaPedido: ['', Validators.required],
      costeTotal: ['', [Validators.required, Validators.min(0)]]
    });
  }

  // Método para obtener los pedidos
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

  // Método para abrir el modal
  abrirModal() {
    const modalElement = document.getElementById('modalAgregarPedido');

    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('El modal con el ID "modalAgregarPedido" no fue encontrado en el DOM.');
    }
  }

  // Método para guardar el pedido
  guardarPedido() {
    if (this.pedidoForm.valid) {
      const nuevoPedido: Pedido = {
        idPedido: this.pedidoForm.value.idPedido,
        fechaPedido: this.pedidoForm.value.fechaPedido,
        costeTotal: this.pedidoForm.value.costeTotal,
        productos: []
      };

      console.log('Nuevo pedido agregado:', nuevoPedido);

      const modalElement = document.getElementById('modalAgregarPedido');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
      }

      this.getPedidos();
    }
  }

  ngOnInit(): void {
    this.getPedidos();
  }

  consultarDetalles(pedido: Pedido) {
    
  }

  editarPedido(pedido: Pedido) {
    
  }

  borrarPedido(pedido: Pedido) {
    
  }
}
