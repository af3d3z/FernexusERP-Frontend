import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Pedido} from '../../interfaces/entidades';
import {Observable} from 'rxjs';
import {Global} from '../global';

@Injectable({
  providedIn: 'root'
})

export class PedidosService {


  constructor(private http: HttpClient) { }

  /**
   * Devuelve todos los pedidos
   */
  get(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(Global.URL_API + "/Pedido", {headers: new HttpHeaders({timeout: `${30000}`})});
  }

  /**
   * Devuelve un pedido en base a su id
   * @param idProducto
   */
  getPedidoPorId(idProducto: number): Observable<Pedido> {
    return this.http.get<Pedido>(`https://fernexus-api.azurewebsites.net/api/Pedido/${idProducto}`);
  }

  /**
   * Devuelve los pedidos comprendidos entre dos fechas
   * @param fechaInicial
   * @param fechaFinal
   */
  getPedidosFecha(fechaInicial: string, fechaFinal: string){
    return this.http.get<Pedido[]>(Global.URL_API + "/Pedido/?fechaInicio=" + fechaInicial + "&fechaFin=" + fechaFinal);
  }

  /**
   * Devuelve los pedidos que contienen un producto en concreto
   * @param idProducto
   */
  getPedidosProducto(idProducto: number): Observable<Pedido[]>{
    return this.http.get<Pedido[]>(Global.URL_API + "/Pedido/" + idProducto);
  }

  /**
   * Agrega un pedido y devuelve el número de filas afectadas
   * @param pedido
   */
  post(pedido: {
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
  }[]): Observable<string> {
    return this.http.post<string>(Global.URL_API + "/Pedido", pedido, { responseType: 'text' as 'json' });
  }

  /**
   * Borra un pedido por su id
   * @param idPedido
   */
  delete(idPedido: number): Observable<string> {
    return this.http.delete(Global.URL_API + "/Pedido/" + idPedido, {
      responseType: "text" as const // Asegura que el tipo sea "text"
    });
  }

  /**
   * Actualiza un pedido en concreto
   * @param idPedido
   * @param pedido
   */
  update(idPedido: number, pedido: Pedido): Observable<string> {
    return this.http.put<string>(Global.URL_API + "/Pedido/" + idPedido, pedido, { responseType: 'text' as 'json' });
  }

}
