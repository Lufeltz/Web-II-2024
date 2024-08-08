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

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  constructor(private _http: HttpClient) {}

  NEW_URL = 'http://localhost:8080/pedido';

  httpOptions = {
    observe: 'response' as 'response',
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  listar(): Observable<PedidoDto[] | null> {
    return this._http
      .get<PedidoDto[]>(this.NEW_URL + '/listar', this.httpOptions)
      .pipe(
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

  listarPorIdUsuario(isUsuario: number): Observable<PedidoDto[] | null> {
    return this._http
      .get<PedidoDto[]>(
        `${this.NEW_URL}/listarPorIdUsuario/${isUsuario}`,
        this.httpOptions
      )
      .pipe(
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

  listarPorIdCliente(idCliente: number): Observable<PedidoDto[] | null> {
    return this._http
      .get<PedidoDto[]>(
        `${this.NEW_URL}/listarPorIdCliente/${idCliente}`,
        this.httpOptions
      )
      .pipe(
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

  consultar(
    numeroPedido: number,
    idCliente: number
  ): Observable<PedidoDto | null> {
    const params = new HttpParams()
      .set('numeroPedido', numeroPedido)
      .set('idCliente', idCliente);
    return this._http
      .get<PedidoDto>(`${this.NEW_URL}/consultar`, {
        params,
        observe: 'response',
      })
      .pipe(
        map((resp: HttpResponse<PedidoDto>) => {
          if (resp.status === 200) {
            return resp.body;
          } else {
            return null;
          }
        }),
        catchError((err) => {
          if (err.status === 404) {
            return of(null);
          } else {
            return throwError(() => err);
          }
        })
      );
  }

  atualizarPorCliente(
    numeroPedido: number,
    pedidoDto: PedidoDto
  ): Observable<PedidoDto | null> {
    return this._http
      .put<PedidoDto>(
        `${this.NEW_URL}/atualizarPorCliente/${numeroPedido}`,
        JSON.stringify(pedidoDto),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<PedidoDto>) => {
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

  atualizarPorFuncionario(
    numeroPedido: number,
    pedidoDto: PedidoDto
  ): Observable<PedidoDto | null> {
    return this._http
      .put<PedidoDto>(
        `${this.NEW_URL}/atualizarPorFuncionario/${numeroPedido}`,
        JSON.stringify(pedidoDto),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<PedidoDto>) => {
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

  cadastrar(pedidoDto: PedidoDto): Observable<PedidoDto | null> {
    return this._http
      .post<PedidoDto>(
        `${this.NEW_URL}/cadastrar`,
        JSON.stringify(pedidoDto),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<PedidoDto>) => {
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

  getAllPedidos(): Observable<Pedido[] | null> {
    return this._http
      .get<Pedido[]>(this.NEW_URL + '/listar', this.httpOptions)
      .pipe(
        map((resp: HttpResponse<Pedido[]>) => {
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

  getAllPedidosDto(): Observable<PedidoDto[] | null> {
    return this._http
      .get<PedidoDto[]>(this.NEW_URL + '/listar', this.httpOptions)
      .pipe(
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

  postPedido(pedido: PedidoDto): Observable<PedidoDto | null> {
    return this._http
      .post<PedidoDto>(
        this.NEW_URL + '/cadastrar',
        JSON.stringify(pedido),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<PedidoDto>) => {
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
}
