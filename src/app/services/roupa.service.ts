import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoupaModel } from '../models/roupa.model';

const BASE_URL = 'http://localhost:3000/';
@Injectable({
  providedIn: 'root'
})
export class RoupaService {
  constructor(private http: HttpClient) {}

  getRoupas(): Observable<RoupaModel[]> {
    return this.http.get<RoupaModel[]>(BASE_URL + 'roupas');
  }
}
