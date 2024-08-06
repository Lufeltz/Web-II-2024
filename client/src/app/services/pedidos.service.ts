import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, throwError } from 'rxjs';
import { Pedido } from '../shared/models/pedido.model';
import { PedidoDto } from '../shared/models/dto/pedido-dto.model';

const BASE_URL = 'http://localhost:3000/';
@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  constructor(private _http: HttpClient) {}

  // ===============================[NEW]===============================

  NEW_URL = 'http://localhost:8080/pedido';

  httpOptions = {
    observe: 'response' as 'response',
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  // arrumar a URL em NEW_URL e nos métodos
  getAllPedidos(): Observable<PedidoDto[] | null> {
    return this._http.get<PedidoDto[]>(this.NEW_URL + "/listar", this.httpOptions).pipe(
      map((resp: HttpResponse<PedidoDto[]>) => {
        if (resp.status == 200) {
          return resp.body;
        } else {
          return [];
        }
      }),
      catchError((err, caught) => {
        if (err.status == 404) {
          return of([]);
        } else {
          return throwError(() => err);
        }
      })
    );
  }

  getPedidoById(id: number): Observable<Pedido | null> {
    return this._http
      .get<Pedido>(`${this.NEW_URL}/????/${id}`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<Pedido>) => {
          if (resp.status == 200) {
            return resp.body;
          } else {
            return null;
          }
        }),
        catchError((err, caught) => {
          if (err.status == 404) {
            return of(null);
          } else {
            return throwError(() => err);
          }
        })
      );
  }

  postPedido(pedido: Pedido): Observable<Pedido | null> {
    return this._http
      .post<Pedido>(this.NEW_URL, JSON.stringify(pedido), this.httpOptions)
      .pipe(
        map((resp: HttpResponse<Pedido>) => {
          if (resp.status == 201) {
            return resp.body;
          } else {
            return null;
          }
        }),
        catchError((err, caught) => {
          return throwError(() => err);
        })
      );
  }

  putPedido(pedido: Pedido): Observable<Pedido | null> {
    return this._http
      .put<Pedido>(
        `${this.NEW_URL}/???/${pedido.id}`,
        JSON.stringify(pedido),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<Pedido>) => {
          if (resp.status == 200) {
            return resp.body;
          } else {
            return null;
          }
        }),
        catchError((err, caught) => {
          return throwError(() => err);
        })
      );
  }

  deletePedido(id: number): Observable<Pedido | null> {
    return this._http
      .delete<Pedido>(`${this.NEW_URL}/???/${id}`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<Pedido>) => {
          if (resp.status == 200) {
            return resp.body;
          } else {
            return null;
          }
        }),
        catchError((err, caught) => {
          return throwError(() => err);
        })
      );
  }

  // ===============================[NEW]===============================

  getPedidos(): Observable<Pedido[]> {
    return this._http.get<Pedido[]>(BASE_URL + 'pedidos');
  }

  getPedidoByCodigo(codigoPedido: string): Observable<Pedido[]> {
    const params = new HttpParams().set('codigoPedido', codigoPedido);
    return this._http.get<Pedido[]>(`${BASE_URL}pedidos`, { params });
  }

  getPedidosByDates(dataInicio: string, dataFim: string): Observable<Pedido[]> {
    const datasEntrePeriodo = this.getDatasEntrePeriodo(dataInicio, dataFim);
    const pedidosPorData = datasEntrePeriodo.map((data) =>
      this.getPedidosDate(data)
    );
    return forkJoin(pedidosPorData).pipe(
      map((pedidosArrays) =>
        pedidosArrays.reduce((acc, cur) => acc.concat(cur), [])
      )
    );
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

  private getPedidosDate(dataCriacao: string): Observable<Pedido[]> {
    const params = new HttpParams().set('dataCriacao', dataCriacao);
    return this._http.get<Pedido[]>(BASE_URL + 'pedidos', { params });
  }
}
