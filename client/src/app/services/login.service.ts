import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../models/login.model';

const BASE_URL = 'http://localhost:3000/';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<Login[]>{
    const params = new HttpParams().set('email', email).set('password', password);
    return this.http.get<Login[]>(BASE_URL + 'users', { params });
  }
}
