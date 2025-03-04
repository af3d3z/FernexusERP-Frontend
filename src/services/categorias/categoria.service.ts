import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Categoria} from '../../interfaces/entidades';
import {Global} from '../global';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor() { }

  http = inject(HttpClient);

  get(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(Global.URL_API + "/Categorias");
  }
}
