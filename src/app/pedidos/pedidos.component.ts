import { Component, OnInit } from '@angular/core';
import { AppMenuComponent } from '../app-menu/app-menu.component';
import { CurrencyPipe, NgFor, CommonModule } from '@angular/common';
import {Pedido, ProductoCompleto} from '../../interfaces/entidades';
import { PedidosService } from '../../services/pedidos/pedidos.service';
import { ProductoService } from '../../services/producto/producto.service';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

declare var bootstrap: any;

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [NgFor, AppMenuComponent, CurrencyPipe, HttpClientModule, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {
  botonColor: string = '#011640';
  pedidos: Pedido[] = [];
  productos: ProductoCompleto[] = [];
  pedidoForm: FormGroup;
  productoSeleccionadoId: number | null = null;
  productosSeleccionados: ProductoCompleto[] = [];
  cantidadProducto: number = 1;

  constructor(
    private pedidosService: PedidosService,
    private productoService: ProductoService,
    private fb: FormBuilder
  ) {
    this.pedidoForm = this.fb.group({
      productos: [[], Validators.required],
      productoSeleccionadoId: ['', Validators.required],
      cantidadProducto: [1, [Validators.required, Validators.min(1)]]
    });
  }

  async getPedidos() {
    this.pedidosService.get().subscribe({
      next: (response) => {
        this.pedidos = response;
      },
      error: (error) => {
        alert("No se han podido rescatar los pedidos: " + error.toString());
      }
    });
  }

  async getProductos() {
    this.productoService.get().subscribe({
      next: (response) => {
        this.productos = response;
      },
      error: (error) => {
        alert("No se han podido rescatar los productos: " + error.toString());
      }
    });
  }

  async postPedidos(p: {
    idProducto: number;
    proveedor: {
      idProveedor: number;
      nombre: string;
      correo: string;
      telefono: string;
      direccion: string;
      pais: string
    };
    nombre: string;
    precioUd: number;
    cantidad: number;
    precioTotal: number;
    categorias: { idCategoria: number; nombre: string }[]
  }[]) {
    this.pedidosService.post(p).subscribe({
      next: (response) => {
        console.log('Nuevo pedido agregado: ' + p, response);
        this.getPedidos();
        this.getProductos();
      },
      error: (error) => {
        console.error('Error al agregar pedido:', error);
        alert("No se ha podido insertar el pedido: " + error.toString());
      }
    })
  }

  abrirModal() {
    const modalElement = document.getElementById('modalAgregarPedido');

    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('El modal con el ID "modalAgregarPedido" no fue encontrado en el DOM.');
    }
  }

  guardarPedido() {
    if (this.productosSeleccionados.length === 0) {
      alert("Debe agregar al menos un producto.");
      return;
    }

    const productosFormateados = this.productosSeleccionados.map(producto => ({
      idProducto: producto.idProducto,
      proveedor: {
        idProveedor: producto.proveedor?.idProveedor || 0,
        nombre: producto.proveedor?.nombre || "string",
        correo: producto.proveedor?.correo || "string",
        telefono: producto.proveedor?.telefono || "string",
        direccion: producto.proveedor?.direccion || "string",
        pais: producto.proveedor?.pais || "string"
      },
      nombre: producto.nombre || "string",
      precioUd: producto.precioUd || 0,
      cantidad: producto.cantidad || 0,
      precioTotal: producto.precioTotal || 0,
      categorias: producto.categorias?.map(categoria => ({
        idCategoria: categoria.idCategoria || 0,
        nombre: categoria.nombre || "string"
      })) || []
    }));

    this.postPedidos(productosFormateados);

    // Cerrar modal
    const modalElement = document.getElementById('modalAgregarPedido');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    }

    this.getPedidos();
    this.productosSeleccionados = []; // Limpiar la lista para el siguiente pedido
  }

  agregarProducto() {
    const productoId = this.pedidoForm.get('productoSeleccionadoId')?.value;
    const cantidad = this.pedidoForm.get('cantidadProducto')?.value;

    if (!productoId) {
      alert("Seleccione un producto antes de agregarlo.");
      return;
    }

    if (!cantidad || cantidad <= 0) {
      alert("La cantidad debe ser mayor que 0.");
      return;
    }

    const producto = this.productos.find(p => p.idProducto === Number(productoId));
    if (!producto) {
      alert("Producto no encontrado.");
      return;
    }

    if (this.productosSeleccionados.length > 0) {
      const idProveedor = this.productosSeleccionados[0].proveedor.idProveedor;
      if (producto.proveedor.idProveedor !== idProveedor) {
        alert("Todos los productos deben ser del mismo proveedor.");
        return;
      }
    }

    const precioTotal = producto.precioUd * cantidad;

    const productoPost = { ...producto, cantidad, precioTotal};

    this.productosSeleccionados.push(productoPost);

    this.pedidoForm.get('productoSeleccionadoId')?.setValue(null); // Resetear el dropdown
    this.pedidoForm.get('cantidadProducto')?.setValue(1);
  }

  eliminarProducto(idProducto: number) {
    this.productosSeleccionados = this.productosSeleccionados.filter(p => p.idProducto !== idProducto);
  }

  ngOnInit(): void {
    this.getPedidos();
    this.getProductos();
  }

  consultarDetalles(pedido: Pedido) {

  }

  editarPedido(pedido: Pedido) {

  }

  borrarPedido(pedido: Pedido) {

  }
}
