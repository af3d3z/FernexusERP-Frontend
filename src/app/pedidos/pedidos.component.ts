import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AppMenuComponent } from '../app-menu/app-menu.component';
import { NgIf } from '@angular/common';
import { Pedido, ProductoCompleto } from '../../interfaces/entidades';
import { PedidosService } from '../../services/pedidos/pedidos.service';
import swal from 'sweetalert';
import { CurrencyPipe, NgFor, CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {ProductoService} from '../../services/producto/producto.service';
import {Router} from '@angular/router';
import {DataTablesModule} from 'angular-datatables';

declare var bootstrap: any;
@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [NgFor, NgIf, AppMenuComponent, CurrencyPipe, HttpClientModule, ReactiveFormsModule, FormsModule, CommonModule, DataTablesModule],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {
  botonColor: string = '#011640';
  @ViewChild('borrarModal') modal!: ElementRef;
  pedidos: Pedido[] = [];
  nPedidoSeleccionado = 0;
  cargando: boolean = true; // Variable para controlar el estado de carga
  pedidoEditando: Pedido | null = null;
  productosEditados: ProductoCompleto[] = [];
  productos: ProductoCompleto[] = [];
  pedidoForm: FormGroup;
  productoSeleccionadoId: number | null = null;
  productosSeleccionados: ProductoCompleto[] = [];
  cantidadProducto: number = 1;

  constructor(
    private pedidosService: PedidosService,
    private productoService: ProductoService,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private router: Router
  ) {
    this.pedidoForm = this.fb.group({
      productos: [[], Validators.required],
      productoSeleccionadoId: ['', Validators.required],
      cantidadProducto: [1, [Validators.required, Validators.min(1)]]
    });
  }

  async getPedidos() {
    this.cargando = true;
    this.pedidosService.get().subscribe({
      next: (response) => {
        this.pedidos = response;
        this.cargando = false;
      },
      error: (error) => {
        swal("Error", "No se han podido cargar los datos.", "error");
        this.cargando = false;
      }
    });
  }

  async getProductos() {
    this.productoService.get().subscribe({
      next: (response) => {
        this.productos = response;
      },
      error: (error) => {
        swal("Error", "No se han podido rescatar los productos: " + error.message, "error");
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
        swal("Nuevo pedido", "Se ha agregado un nuevo pedido.", "success");
        this.getPedidos();
        this.getProductos();
      },
      error: (error) => {
        console.error('Error al agregar pedido:', error);
        swal("Nuevo pedido", "No se ha podido agregar el pedido", "error")
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
      swal("Error", "Seleccione un producto antes de agregarlo.", "error");
      return;
    }

    if (!cantidad || cantidad <= 0) {
      swal("Error", "La cantidad debe ser mayor que 0.", "error");
      return;
    }

    const producto = this.productos.find(p => p.idProducto === Number(productoId));
    if (!producto) {
      swal("Error 404", "Producto no encontrado.", "error");
      return;
    }

    if (this.productosSeleccionados.length > 0) {
      const idProveedor = this.productosSeleccionados[0].proveedor.idProveedor;
      if (producto.proveedor.idProveedor !== idProveedor) {
        swal("Error", "Todos los productos deben ser del mismo proveedor.", "error");
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
    this.router.navigate(['detalles/', pedido.idPedido]);
  }

  editarPedido(pedido: Pedido) {
    this.pedidoEditando = {...pedido};
    this.productosEditados = pedido.productos.map(prod => ({ ...prod }));

    const modalElement = document.getElementById('modalEditarPedido');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  agregarProductoEditado() {
    const productoId = this.pedidoForm.get('productoSeleccionadoId')?.value;
    const cantidad = this.pedidoForm.get('cantidadProducto')?.value;

    if (!productoId) {
      swal("Error", "Seleccione un producto antes de agregarlo.", "error");
      return;
    }

    if (!cantidad || cantidad <= 0) {
      swal("Error", "La cantidad debe ser mayor que 0.", "error");
      return;
    }

    const producto = this.productos.find(p => p.idProducto === Number(productoId));
    if (!producto) {
      swal("Error 404", "Producto no encontrado.", "error");
      return;
    }

    if (this.productosEditados.length > 0) {
      const idProveedor = this.productosEditados[0].proveedor.idProveedor;
      if (producto.proveedor.idProveedor !== idProveedor) {
        swal("Error", "Todos los productos deben ser del mismo proveedor.", "error");

        // Desmarcar el producto en el formulario
        this.pedidoForm.get('productoSeleccionadoId')?.setValue(null);
        return; // No agregar el producto
      }
    }

    const productoExistente = this.productosEditados.find(p => p.idProducto === productoId);
    if (productoExistente) {
      productoExistente.cantidad += cantidad;
      productoExistente.precioTotal = productoExistente.precioUd * productoExistente.cantidad;
    } else {
      const precioTotal = producto.precioUd * cantidad;
      this.productosEditados.push({ ...producto, cantidad, precioTotal });
    }

    this.pedidoForm.get('productoSeleccionadoId')?.setValue(null); // Reset dropdown
    this.pedidoForm.get('cantidadProducto')?.setValue(1);
  }

  eliminarProductoEditado(idProducto: number) {
    this.productosEditados = this.productosEditados.filter(p => p.idProducto !== idProducto);
  }

  actualizarPedido() {
    if (!this.pedidoEditando) return;

    if (this.productosEditados.length === 0) {
      swal("Error", "Debe agregar al menos un producto.", "error");
      return;
    }

    this.pedidoEditando.productos = this.productosEditados;

    this.pedidosService.update(this.pedidoEditando.idPedido, this.pedidoEditando).subscribe({
      next: (response) => {
        if (response === "Se ha actualizado el pedido correctamente") {
          swal("Éxito", "Pedido actualizado correctamente", "success");
          this.getPedidos();
        } else if (response === "No se ha podido actualizar el pedido" || response === "No existe ningún pedido con ese ID") {
          swal("Error", response, "error");
        } else {
          swal("Error", "Hubo un problema al actualizar el pedido", "error");
        }
      },
      error: (err) => {
        swal("Error", "Hubo un problema al actualizar el pedido", "error");
      }
    });

    const modalElement = document.getElementById('modalEditarPedido');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    }
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

}
