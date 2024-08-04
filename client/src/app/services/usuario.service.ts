import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario2 } from '../shared/models/usuario2.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(private _http: HttpClient) {}

  BASE_URL = 'http://localhost:3000/usuarios';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  listarTodos(): Observable<Usuario2[]> {
    return this._http.get<Usuario2[]>(this.BASE_URL, this.httpOptions);
  }
  buscarPorId(id: number): Observable<Usuario2> {
    return this._http.get<Usuario2>(this.BASE_URL + '/' + id, this.httpOptions);
  }

  inserir(usuario: Usuario2): Observable<Usuario2> {
    return this._http.post<Usuario2>(
      this.BASE_URL,
      JSON.stringify(usuario),
      this.httpOptions
    );
  }
  remover(id: number): Observable<Usuario2> {
    return this._http.delete<Usuario2>(
      this.BASE_URL + '/' + id,
      this.httpOptions
    );
  }
  alterar(usuario: Usuario2): Observable<Usuario2> {
    return this._http.put<Usuario2>(
      this.BASE_URL + '/' + usuario.id,
      JSON.stringify(usuario),
      this.httpOptions
    );
  }
}
