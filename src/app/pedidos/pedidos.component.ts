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

  /**
   * Usa el service de pedidos para consultar la lista y controla que se muestre o no el spinner
   */
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

  /**
   * Usa el service de productos para consultar la lista de productos
   */
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

  /**
   * Se encarga de agregar un pedido a la BD
   * @param p
   */
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

  /**
   * Abre el modal AgregarPedido
   */
  abrirModal() {
    const modalElement = document.getElementById('modalAgregarPedido');

    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('El modal con el ID "modalAgregarPedido" no fue encontrado en el DOM.');
    }
  }

  /**
   * Función que ejecuta el modal AgregarPedido al pulsar en el botón de guardado
   */
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

  /**
   * Agrega un producto a un pedido en creación
   */
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

    const indexProducto = this.productosSeleccionados.findIndex(p => Number(p.idProducto) === Number(productoId));

    if (indexProducto !== -1) {
      const productosActualizados = [...this.productosSeleccionados];

      productosActualizados[indexProducto] = {
        ...productosActualizados[indexProducto],
        cantidad: productosActualizados[indexProducto].cantidad + cantidad,
        precioTotal: productosActualizados[indexProducto].precioUd *
          (productosActualizados[indexProducto].cantidad + cantidad)
      };

      this.productosSeleccionados = productosActualizados;

    } else {
      const precioTotal = producto.precioUd * cantidad;
      this.productosSeleccionados = [
        ...this.productosSeleccionados,
        { ...producto, cantidad, precioTotal }
      ];
    }

    this.pedidoForm.get('productoSeleccionadoId')?.setValue(null); // Resetear el dropdown
    this.pedidoForm.get('cantidadProducto')?.setValue(1);
  }

  /**
   * Elimina un producto de un pedido en creación
   * @param idProducto
   */
  eliminarProducto(idProducto: number) {
    this.productosSeleccionados = this.productosSeleccionados.filter(p => p.idProducto !== idProducto);
  }

  /**
   * Llama en el inicio a estas dos funciones para tener la tabla de pedidos y el selector de productos guardados en memoria
   */
  ngOnInit(): void {
    this.getPedidos();
    this.getProductos();
  }

  /**
   * Lleva a la página de consultar detalles de un pedido en concreto
   * @param pedido
   */
  consultarDetalles(pedido: Pedido) {
    this.router.navigate(['detalles/', pedido.idPedido]);
  }

  /**
   * Abre el modal EditarPedido
   * @param pedido
   */
  editarPedido(pedido: Pedido) {
    this.pedidoEditando = {...pedido};
    this.productosEditados = pedido.productos.map(prod => ({ ...prod }));

    const modalElement = document.getElementById('modalEditarPedido');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  /**
   * Agrega un producto a un pedido que está siendo editado
   */
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

    const indexProducto = this.productosEditados.findIndex(p => Number(p.idProducto) === Number(productoId));

    if (indexProducto !== -1) {
      const productosActualizados = [...this.productosEditados];

      productosActualizados[indexProducto] = {
        ...productosActualizados[indexProducto],
        cantidad: productosActualizados[indexProducto].cantidad + cantidad,
        precioTotal: productosActualizados[indexProducto].precioUd *
          (productosActualizados[indexProducto].cantidad + cantidad)
      };

      this.productosEditados = productosActualizados;

    } else {
      const precioTotal = producto.precioUd * cantidad;
      this.productosEditados = [
        ...this.productosEditados,
        { ...producto, cantidad, precioTotal }
      ];
    }

    this.productosEditados = [...this.productosEditados];

    this.pedidoForm.get('productoSeleccionadoId')?.setValue(null); // Reset dropdown
    this.pedidoForm.get('cantidadProducto')?.setValue(1);
  }

  /**
   * Elimina un producto de un pedido que está siendo editado
   * @param idProducto
   */
  eliminarProductoEditado(idProducto: number) {
    this.productosEditados = this.productosEditados.filter(p => p.idProducto !== idProducto);
  }

  /**
   * Actualiza un pedido mediante el service de pedidos
   */
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

  /**
   * Borra un pedido mediante el service de pedidos
   * @param nPedido
   */
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

  /**
   * Abre el modal de borrado
   * @param pedido
   */
  abrirModalDelete(pedido: Pedido) {
    this.nPedidoSeleccionado = pedido.idPedido;
    this.renderer.addClass(this.modal.nativeElement, 'show');
    this.renderer.setStyle(this.modal.nativeElement, 'display', 'block');
  }

  /**
   * Cierra el modal de borrado
   */
  cerrarModalDelete() {
    this.nPedidoSeleccionado = 0;
    this.renderer.removeClass(this.modal.nativeElement, 'show');
    this.renderer.setStyle(this.modal.nativeElement, 'display', 'none');
  }

}
