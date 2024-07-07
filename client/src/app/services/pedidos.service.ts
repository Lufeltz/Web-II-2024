import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
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

  getPedidosByDates(dataInicio: string, dataFim: string): Observable<PedidoModel[]> {
    const datasEntrePeriodo = this.getDatasEntrePeriodo(dataInicio, dataFim);
    const pedidosPorData = datasEntrePeriodo.map(data =>this.getPedidosDate(data));
    return forkJoin(pedidosPorData).pipe(map(pedidosArrays => pedidosArrays.reduce((acc, cur) => acc.concat(cur), [])));
  }

  private getDatasEntrePeriodo(dataInicio: string, dataFim: string): string[] {
    const datas = [];
    let currentDate = new Date(dataInicio);
    const endDate = new Date(dataFim);

    while (currentDate <= endDate) {
      datas.push(this.formatDate(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return datas;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private getPedidosDate(dataCriacao: string): Observable<PedidoModel[]> {
    const params = new HttpParams().set('dataCriacao', dataCriacao);
    return this.http.get<PedidoModel[]>(BASE_URL + 'pedidos', { params });
  }

}
