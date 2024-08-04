import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Usuario } from '../shared/models/usuario.model';
import { RelatorioCliente } from '../shared/models/relatorio-cliente.model';
import { ClienteFiel } from '../shared/models/cliente-fiel.model';
import { Cliente } from '../shared/models/cliente.model';

const BASE_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  constructor(private _http: HttpClient) {}

  // ===============================[NEW]===============================

  NEW_URL = 'http://localhost:8080/cliente';

  httpOptions = {
    observe: 'response' as 'response',
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  // arrumar a URL em NEW_URL e nos métodos
  getAllClientes(): Observable<Cliente[] | null> {
    return this._http.get<Cliente[]>(this.NEW_URL, this.httpOptions).pipe(
      map((resp: HttpResponse<Cliente[]>) => {
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

  getClienteById(id: number): Observable<Cliente | null> {
    return this._http
      .get<Cliente>(`${this.NEW_URL}/consultar/${id}`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<Cliente>) => {
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

  postCliente(cliente: Cliente): Observable<Cliente | null> {
    return this._http
      .post<Cliente>(this.NEW_URL, JSON.stringify(cliente), this.httpOptions)
      .pipe(
        map((resp: HttpResponse<Cliente>) => {
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

  putCliente(cliente: Cliente): Observable<Cliente | null> {
    return this._http
      .put<Cliente>(
        `${this.NEW_URL}/???/${cliente.id}`,
        JSON.stringify(cliente),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<Cliente>) => {
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

  deleteCliente(id: number): Observable<Cliente | null> {
    return this._http
      .delete<Cliente>(`${this.NEW_URL}/???/${id}`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<Cliente>) => {
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

  getClientesRelatorio(): Observable<RelatorioCliente[]> {
    return this._http.get<RelatorioCliente[]>(BASE_URL + '/clientes');
  }

  getClientes(): Observable<Usuario[]> {
    return this._http.get<Usuario[]>(BASE_URL + '/clientes');
  }

  // getClienteById(clienteId: number): Observable<Usuario> {
  //   return this._http.get<Usuario>(`${BASE_URL}/clientes/${clienteId}`);
  // }

  getClienteFielById(clienteId: number): Observable<ClienteFiel> {
    return this._http.get<ClienteFiel>(`${BASE_URL}/clientes/${clienteId}`);
  }
}
