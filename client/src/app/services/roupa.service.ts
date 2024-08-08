import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Roupa } from '../shared/models/roupa.model';
import { RoupaDto } from '../shared/models/dto/roupa-dto.model';

@Injectable({
  providedIn: 'root',
})
export class RoupaService {
  constructor(private _http: HttpClient) {}

  NEW_URL = 'http://localhost:8080/roupa';

  httpOptions = {
    observe: 'response' as 'response',
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  listar(): Observable<RoupaDto[] | null> {
    return this._http
      .get<RoupaDto[]>(`${this.NEW_URL}/listar`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<RoupaDto[]>) => {
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

  getAllRoupas(): Observable<Roupa[] | null> {
    return this._http
      .get<Roupa[]>(`${this.NEW_URL}/listar`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<Roupa[]>) => {
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

  getRoupaById(id: number): Observable<Roupa | null> {
    return this._http
      .get<Roupa>(`${this.NEW_URL}/????/${id}`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<Roupa>) => {
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

  postRoupa(roupa: Roupa): Observable<Roupa | null> {
    return this._http
      .post<Roupa>(
        `${this.NEW_URL}/cadastrar`,
        JSON.stringify(roupa),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<Roupa>) => {
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

  putRoupa(roupa: RoupaDto): Observable<RoupaDto | null> {
    return this._http
      .put<RoupaDto>(
        `${this.NEW_URL}/atualizar/${roupa.idRoupa}`,
        JSON.stringify(roupa),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<RoupaDto>) => {
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

  deleteRoupa(id: number): Observable<RoupaDto | null> {
    return this._http
      .delete<RoupaDto>(`${this.NEW_URL}/inativar/${id}`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<RoupaDto>) => {
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
