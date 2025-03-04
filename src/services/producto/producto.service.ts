import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Producto} from '../../interfaces/entidades';
import {Global} from '../global';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor() { }

  http = inject(HttpClient);

  get(): Observable<Producto[]> {
    return this.http.get<Producto[]>(Global.URL_API + "/Productos");
  }

  getPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(Global.URL_API + "/Productos/"+ id);
  }

  getPorCategoria(categoria: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(Global.URL_API + "/Productos/categorias/" + categoria);
  }

}
