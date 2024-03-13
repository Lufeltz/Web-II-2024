import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PedidosModel } from '../models/pedidoModel';

const BASE_URL = 'https://jsonplaceholder.typicode.com/todos';
@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  constructor(private http: HttpClient) {}

  getPedidos(): Observable<PedidosModel[]> {
    return this.http.get<PedidosModel[]>(BASE_URL);
  }
}
