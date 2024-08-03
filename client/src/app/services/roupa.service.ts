import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Roupa } from '../shared/models/roupa.model';

const BASE_URL = 'http://localhost:3000/';
@Injectable({
  providedIn: 'root'
})
export class RoupaService {
  constructor(private http: HttpClient) {}

  getRoupas(): Observable<Roupa[]> {
    return this.http.get<Roupa[]>(BASE_URL + 'pedidosRoupas');
  }
}
