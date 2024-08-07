import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { EnderecoDto } from '../shared/models/dto/endereco-dto.model';


@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  constructor(private _http: HttpClient) {}

  // ===============================[NEW]===============================

  NEW_URL = 'http://localhost:8080/endereco';

  httpOptions = {
    observe: 'response' as 'response',
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  //MATHEUS MATHEUS MATHEUS MATHEUS MATHEUS MATHEUS MATHEUS MATHEUS MATHEUS MATHEUS

  consultar(cep: number): Observable<EnderecoDto | null> {
    return this._http
      .get<EnderecoDto>(`${this.NEW_URL}/consultar/${cep}`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<EnderecoDto>) => {
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

  //MATHEUS MATHEUS MATHEUS MATHEUS MATHEUS MATHEUS MATHEUS MATHEUS MATHEUS MATHEUS

}
