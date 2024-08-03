import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../shared/models/usuario.model';
import { RelatorioCliente } from '../shared/models/relatorio-cliente.model';
import { ClienteFiel } from '../shared/models/cliente-fiel.model';

const BASE_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private _http: HttpClient) {}

  getClientesRelatorio(): Observable<RelatorioCliente[]> {
    return this._http.get<RelatorioCliente[]>(BASE_URL + '/clientes');
  }

  getClientes(): Observable<Usuario[]> {
    return this._http.get<Usuario[]>(BASE_URL + '/clientes');
  }

  getClienteById(clienteId: number): Observable<Usuario> {
    return this._http.get<Usuario>(`${BASE_URL}/clientes/${clienteId}`);
  }

  getClienteFielById(clienteId: number): Observable<ClienteFiel> {
    return this._http.get<ClienteFiel>(`${BASE_URL}/clientes/${clienteId}`);
  }
}
