import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PessoaModel } from '../models/pessoa.model';

const BASE_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private _http: HttpClient) {}

  getClientes(): Observable<PessoaModel[]> {
    return this._http.get<PessoaModel[]>(BASE_URL + '/clientes');
  }
}
