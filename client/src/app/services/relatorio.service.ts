import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RelatorioTodosClientes } from '../shared/models/dto/relatorio-todos-clientes';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { ReceitaDto } from '../shared/models/dto/receita-dto.model';
import { ClienteDto } from '../shared/models/dto/cliente-dto.model';
import { ClienteFielDto } from '../shared/models/dto/cliente-fiel-dto.model';

@Injectable({
  providedIn: 'root',
})
export class RelatorioService {
  constructor(private _http: HttpClient) {}

  NEW_URL = 'http://localhost:8080/relatorio';

  httpOptions = {
    observe: 'response' as 'response',
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  visualizarReceitas(
    dataDe: string,
    dataAte: string
  ): Observable<ReceitaDto[] | null> {
    const params = new HttpParams()
      .set('dataDe', dataDe)
      .set('dataAte', dataAte);
    return this._http
      .get<ReceitaDto[]>(`${this.NEW_URL}/visualizarReceitas`, {
        params,
        observe: 'response',
      })
      .pipe(
        map((resp: HttpResponse<ReceitaDto[]>) => {
          if (resp.status === 200) {
            return resp.body || null;
          } else {
            return null;
          }
        }),
        catchError((err) => {
          console.error('Erro ao visualizar receitas:', err);
          return of(null);
        })
      );
  }

  visualizarClientes(): Observable<ClienteDto[] | null> {
    return this._http
      .get<ClienteDto[]>(this.NEW_URL + '/visualizarClientes', this.httpOptions)
      .pipe(
        map((resp: HttpResponse<ClienteDto[]>) => {
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

  visualizarClientesFieis(): Observable<ClienteFielDto[] | null> {
    return this._http
      .get<ClienteFielDto[]>(
        this.NEW_URL + '/visualizarClientesFieis',
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<ClienteFielDto[]>) => {
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

  getAllClientes(): Observable<RelatorioTodosClientes[] | null> {
    return this._http
      .get<RelatorioTodosClientes[]>(
        `${this.NEW_URL}/visualizarClientes`,
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<RelatorioTodosClientes[]>) => {
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

  getAllReceitas(dataDe: Date, dataAte: Date): Observable<ReceitaDto[] | null> {
    const params = new HttpParams()
      .set('dataDe', dataDe.toISOString().split('T')[0])
      .set('dataAte', dataAte.toISOString().split('T')[0]);

    return this._http
      .get<ReceitaDto[]>(`${this.NEW_URL}/visualizarReceitas`, {
        params,
        ...this.httpOptions,
      })
      .pipe(
        map((resp: HttpResponse<ReceitaDto[]>) => {
          if (resp.status == 200) {
            return resp.body;
          } else {
            return [];
          }
        }),
        catchError((err) => {
          if (err.status === 404) {
            return of([]);
          } else {
            return throwError(() => err);
          }
        })
      );
  }

  getAllClientesFieis(): Observable<ClienteFielDto[] | null> {
    return this._http
      .get<ClienteFielDto[]>(
        `${this.NEW_URL}/visualizarClientesFieis`,
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<ClienteFielDto[]>) => {
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
}
