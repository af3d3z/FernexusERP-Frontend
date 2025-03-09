import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProductoCompleto} from '../../interfaces/entidades';
import {Global} from '../global';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor() { }

  http = inject(HttpClient);

  /**
   * Devuelve la lista de productos disponibles
   */
  get(): Observable<ProductoCompleto[]> {
    return this.http.get<ProductoCompleto[]>(Global.URL_API + "/Producto");
  }

  /**
   * Deveulve un producto con el id especificado
   * @param id
   */
  getPorId(id: number): Observable<ProductoCompleto> {
    return this.http.get<ProductoCompleto>(Global.URL_API + "/Producto/"+ id);
  }

  /**
   * Devuelve una lista de productos con una categoría en concreto
   * @param categoria id de la categoría a consultar
   */
  getPorCategoria(categoria: number): Observable<ProductoCompleto[]> {
    return this.http.get<ProductoCompleto[]>(Global.URL_API + "/Producto/categoria/" + categoria);
  }

}
