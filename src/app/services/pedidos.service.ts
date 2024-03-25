import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PedidoModel } from '../models/pedido.model';

const BASE_URL = 'http://localhost:3000/';
@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  constructor(private http: HttpClient) {}

  getPedidos(): Observable<PedidoModel[]> {
    return this.http.get<PedidoModel[]>(BASE_URL + 'pedidos');
  }

  getPedidoByCodigo(codigoPedido: string): Observable<PedidoModel[]> {
    const params = new HttpParams().set('codigoPedido', codigoPedido);
    return this.http.get<PedidoModel[]>(BASE_URL + 'pedidos', { params });
  }
}
