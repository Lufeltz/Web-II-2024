import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Roupa } from '../shared/models/roupa.model';

const BASE_URL = 'http://localhost:3000/';
@Injectable({
  providedIn: 'root',
})
export class RoupaService {
  constructor(private _http: HttpClient) {}

  // ===============================[NEW]===============================

  NEW_URL = 'http://localhost:8080/?????';

  httpOptions = {
    observe: 'response' as 'response',
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  // arrumar a URL em NEW_URL e nos métodos
  getAllRoupas(): Observable<Roupa[] | null> {
    return this._http.get<Roupa[]>(this.NEW_URL, this.httpOptions).pipe(
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
      .post<Roupa>(this.NEW_URL, JSON.stringify(roupa), this.httpOptions)
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

  putRoupa(roupa: Roupa): Observable<Roupa | null> {
    return this._http
      .put<Roupa>(
        `${this.NEW_URL}/???/${roupa.id}`,
        JSON.stringify(roupa),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<Roupa>) => {
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

  deleteRoupa(id: number): Observable<Roupa | null> {
    return this._http
    .delete<Roupa>(`${this.NEW_URL}/???/${id}`, this.httpOptions)
    .pipe(
      map((resp: HttpResponse<Roupa>) => {
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

  getRoupas(): Observable<Roupa[]> {
    return this._http.get<Roupa[]>(BASE_URL + 'pedidosRoupas');
  }
}
