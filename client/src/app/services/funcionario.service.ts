import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Funcionario } from '../shared/models/funcionario.model';

const BASE_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class FuncionarioService {
  constructor(private _http: HttpClient) {}

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

  deleteFuncionario(id: number) {
    return this._http.delete<Funcionario>(
      `${BASE_URL}/funcionarios/${id}`
    );
  }
}
