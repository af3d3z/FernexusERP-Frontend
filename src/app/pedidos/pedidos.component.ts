import { Component } from '@angular/core';
import {AppMenuComponent} from '../app-menu/app-menu.component';
import {CurrencyPipe, NgClass, NgFor, CommonModule} from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, NgFor, AppMenuComponent, CurrencyPipe, NgClass, ReactiveFormsModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.scss'
})
export class PedidosComponent {
  botonColor: string = '#011640';
  mostrarModal: boolean = false;
  modalBackgroundColor: string = '#233a59';

  pedidos = [
    { proveedor: 'Proveedor A', producto: 'Producto X', cantidad: 100, precio: 15.00, fechaPedido: '2025-03-01', estado: 'Pendiente' },
    { proveedor: 'Proveedor B', producto: 'Producto Y', cantidad: 50, precio: 25.00, fechaPedido: '2025-03-02', estado: 'Completado' },
    { proveedor: 'Proveedor C', producto: 'Producto Z', cantidad: 200, precio: 10.00, fechaPedido: '2025-03-03', estado: 'Cancelado' }
  ];

  pedidoForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.pedidoForm = this.fb.group({
      proveedor: ['', Validators.required],
      producto: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      fechaPedido: [new Date().toISOString().split('T')[0], Validators.required],
      estado: ['Pendiente', Validators.required]
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'Pendiente': return 'badge bg-info text-dark';
      case 'Completado': return 'badge bg-success';
      case 'Cancelado': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  agregarPedido() {
    this.mostrarModal = true; // Muestra el modal
  }

  cerrarModal() {
    this.mostrarModal = false; // Oculta el modal
  }

  guardarPedido() {
    if (this.pedidoForm.valid) {
      this.pedidos.push(this.pedidoForm.value);
      this.cerrarModal();
    }
  }

}
