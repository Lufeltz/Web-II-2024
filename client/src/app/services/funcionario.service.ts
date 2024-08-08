import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Funcionario } from '../shared/models/funcionario.model';
import { FuncionarioDto } from '../shared/models/dto/funcionario-dto.model';

const BASE_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class FuncionarioService {
  constructor(private _http: HttpClient) {}

  NEW_URL = 'http://localhost:8080/funcionario';

  httpOptions = {
    observe: 'response' as 'response',
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };


  consultarPorIdUsuario(idUsuario: number): Observable<FuncionarioDto | null> {
    return this._http
      .get<FuncionarioDto>(`${this.NEW_URL}/consultar/${idUsuario}`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<FuncionarioDto>) => {
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

  getAllFuncionarios(): Observable<Funcionario[] | null> {
    return this._http
      .get<Funcionario[]>(`${this.NEW_URL}/listar`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<Funcionario[]>) => {
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

  getFuncionarioById(id: number): Observable<Funcionario | null> {
    return this._http
      .get<Funcionario>(`${this.NEW_URL}/????/${id}`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<Funcionario>) => {
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

  postFuncionario(
    funcionario: Funcionario
  ): Observable<Funcionario | null> {
    return this._http
      .post<Funcionario>(
        `${this.NEW_URL}/cadastrar`,
        JSON.stringify(funcionario),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<Funcionario>) => {
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

  putFuncionario(
    funcionario: Funcionario
  ): Observable<Funcionario | null> {
    return this._http
      .put<Funcionario>(
        `${this.NEW_URL}/atualizar/${funcionario.idFuncionario}`,
        JSON.stringify(funcionario),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<Funcionario>) => {
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

  deleteFuncionario(id: number): Observable<Funcionario | null> {
    return this._http
      .delete<Funcionario>(`${this.NEW_URL}/remover/${id}`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<Funcionario>) => {
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

  getFuncionarios(): Observable<Funcionario[]> {
    return this._http.get<Funcionario[]>(BASE_URL + '/funcionarios');
  }

  updateFuncionario(id: number, funcionario: Funcionario) {
    return this._http.put<Funcionario>(`${BASE_URL}/${id}`, funcionario);
  }

  createFuncionario(funcionario: Funcionario) {
    return this._http.post<Funcionario>(
      `${BASE_URL}/funcionarios`,
      funcionario
    );
  }
}
