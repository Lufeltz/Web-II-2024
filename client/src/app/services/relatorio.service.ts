import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RelatorioTodosClientes } from '../shared/models/dto/relatorio-todos-clientes';
import { catchError, map, Observable, of, throwError } from 'rxjs';

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

  getAllClientes(): Observable<RelatorioTodosClientes[] | null> {
    return this._http
      .get<RelatorioTodosClientes[]>(`${this.NEW_URL}/visualizarClientes`, this.httpOptions)
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
}
