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

  get(): Observable<ProductoCompleto[]> {
    return this.http.get<ProductoCompleto[]>(Global.URL_API + "/Producto");
  }

  getPorId(id: number): Observable<ProductoCompleto> {
    return this.http.get<ProductoCompleto>(Global.URL_API + "/Producto/"+ id);
  }

  getPorCategoria(categoria: number): Observable<ProductoCompleto[]> {
    return this.http.get<ProductoCompleto[]>(Global.URL_API + "/Producto/categoria/" + categoria);
  }

}
