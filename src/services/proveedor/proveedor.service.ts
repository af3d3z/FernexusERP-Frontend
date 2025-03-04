import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Proveedor} from '../../interfaces/entidades';
import {Observable} from 'rxjs';
import {Global} from '../global';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  constructor() { }

  http = inject(HttpClient);

    // devuelve el listado de proveedores
    get(): Observable<Proveedor[]>{
      return this.http.get<Proveedor[]>(Global.URL_API + "/Proveedor");
    }

    // devuelve el proveedor con ese id
    getPorId(id: number): Observable<Proveedor>{
      return this.http.get<Proveedor>(Global.URL_API + "/Proveedor/" + id);
    }
}
