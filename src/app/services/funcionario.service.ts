import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FuncionarioModel } from '../models/funcionario.model';

const BASE_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class FuncionarioService {
  constructor(private _http: HttpClient) {}

  getFuncionarios(): Observable<FuncionarioModel[]> {
    return this._http.get<FuncionarioModel[]>(BASE_URL + '/funcionarios');
  }

  updateFuncionario(id: number, funcionario: FuncionarioModel) {
    return this._http.put<FuncionarioModel>(`${BASE_URL}/${id}`, funcionario);
  }

  createFuncionario(funcionario: FuncionarioModel) {
    return this._http.post<FuncionarioModel>(
      `${BASE_URL}/funcionarios`,
      funcionario
    );
  }

  deleteFuncionario(id: number) {
    return this._http.delete<FuncionarioModel>(
      `${BASE_URL}/funcionarios/${id}`
    );
  }
}
