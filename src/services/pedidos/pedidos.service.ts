import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Pedido} from '../../interfaces/entidades';
import {Observable} from 'rxjs';
import {Global} from '../global';

@Injectable({
  providedIn: 'root'
})

export class PedidosService {


  constructor(private http: HttpClient) { }

  // devuelve todos los pedidos
  get(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(Global.URL_API + "/Pedido", {headers: new HttpHeaders({timeout: `${30000}`})});
  }

  // devuelve los pedidos comprendidos entre dos fechas
  getPedidosFecha(fechaInicial: string, fechaFinal: string){
    return this.http.get<Pedido[]>(Global.URL_API + "/Pedido/?fechaInicio=" + fechaInicial + "&fechaFin=" + fechaFinal);
  }

  // devuelve los pedidos de un producto en concreto
  getPedidosProducto(idProducto: number): Observable<Pedido[]>{
    return this.http.get<Pedido[]>(Global.URL_API + "/Pedido/" + idProducto);
  }

  // devuelve el número de filas afectadas
  post(pedido: Pedido): Observable<number> {
    return this.http.post<number>(Global.URL_API + "/Pedido", pedido);
  }

  // borra el pedido y devuelve el número de filas afectadas
  delete(idPedido: number): Observable<string> {
    return this.http.delete(Global.URL_API + "/Pedido/" + idPedido, {
      responseType: "text" as const // Asegura que el tipo sea "text"
    });
  }

  // actualiza el pedido y devuelve el número de filas afectadas
  update(idPedido: number, pedido: Pedido): Observable<number> {
    return this.http.put<number>(Global.URL_API + "/Pedido/" + idPedido, pedido);
  }

}
