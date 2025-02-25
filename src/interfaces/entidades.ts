export interface Proveedor {
  idProveedor: number;
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  pais: string;
}

export interface Categoria {
  idCategoria: number;
  nombre: string;
}

export interface Producto {
  idProducto: number;
  idProveedor: number;
  nombre: string;
  precio: number
  categoria: Categoria[];
}

export interface Pedido {
  idPedido: number;
  productos: Producto[];
  costeTotal: number;
  fechaPedido: string;
}

export interface ProductoCompleto {
  idProducto: number;
  proveedor: Proveedor;
  nombre: string;
  precioUd: number;
  cantidad: number;
  precioTotal: number;
}
