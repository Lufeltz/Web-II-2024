import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Login } from '../shared/models/login.model';
import { Usuario } from '../shared/models/usuario.model';
import { Usuario2 } from '../shared/models/usuario2.model';
import { UsuarioResponseDto } from '../shared/models/dto/usuario-response-dto.model';
import { UsuarioRequestDto } from '../shared/models/dto/usuario-request-dto.model';

const BASE_URL = 'http://localhost:3000/';
const LS_CHAVE: string = 'usuarioLogado';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private _http: HttpClient) {}

  public get usuarioLogado(): Usuario2 {
    let usu = localStorage[LS_CHAVE];
    return usu ? JSON.parse(localStorage[LS_CHAVE]) : null;
  }

  public set usuarioLogado(usuario: Usuario2) {
    localStorage[LS_CHAVE] = JSON.stringify(usuario);
  }

  logout() {
    delete localStorage[LS_CHAVE];
  }

  login(login: Login): Observable<Usuario2 | null> {
    let usu = new Usuario2(1, login.login, login.login, login.senha, 'FUNC');
    if (login.login == login.senha) {
      if (login.login == 'cliente') {
        usu.perfil = 'CLIENTE';
      } else if (login.login == 'funcionario') {
        usu.perfil = 'FUNCIONARIO';
      }
      return of(usu);
    } else {
      return of(null);
    }
  }

  // ===============================[NEW]===============================

  NEW_URL = 'http://localhost:8080/usuario';

  httpOptions = {
    observe: 'response' as 'response',
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  //MATHEUS MATHEUS MATHEUS MATHEUS MATHEUS MATHEUS MATHEUS MATHEUS MATHEUS MATHEUS

  loginCorreto(usuarioRequestDto: UsuarioRequestDto): Observable<UsuarioResponseDto | null> {
    return this._http
      .post<UsuarioResponseDto>(
        `${this.NEW_URL}/login`,
        JSON.stringify(usuarioRequestDto),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<UsuarioResponseDto>) => {
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

  //MATHEUS MATHEUS MATHEUS MATHEUS MATHEUS MATHEUS MATHEUS MATHEUS MATHEUS MATHEUS

  // arrumar a URL em NEW_URL e nos métodos

  // login(login: Login): Observable<Usuario | null> {
  //   return this._http
  //     .post<Usuario>(this.NEW_URL, JSON.stringify(login), this.httpOptions)
  //     .pipe(
  //       map((resp: HttpResponse<Usuario>) => {
  //         if (resp.status == 200) {
  //           return resp.body;
  //         } else {
  //           return null;
  //         }
  //       }),
  //       catchError((err) => {
  //         if (err.status == 401) {
  //           // UNAUTHORIZERD
  //           return of(null);
  //         } else {
  //           return throwError(() => err);
  //         }
  //       })
  //     );
  // }

  // ===============================[NEW]===============================

  // remover esse depois que arrumar o de cima
  // login(email: string, password: string): Observable<Login[]> {
  //   const params = new HttpParams()
  //     .set('email', email)
  //     .set('password', password);
  //   return this._http.get<Login[]>(BASE_URL + 'users', { params });
  // }
}
