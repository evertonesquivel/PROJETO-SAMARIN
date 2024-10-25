import { LoginService } from '../auth/login.service';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError} from 'rxjs';
import { map, catchError} from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Person } from '../../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class DataManagerService {
  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private loginService :  LoginService, ) { }

    getUserProfile(): Observable<any> {
      const token = this.loginService.getToken();
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      return this.http.get(`${this.apiUrl}/profile`, { headers }).pipe(
        map((response: any) => {
          // Acessando o primeiro usuário do array
          return response[0]; // Aqui você pega o primeiro objeto do array
        }),
        catchError(error => {
          console.error('Erro ao buscar perfil do usuário:', error);
          return throwError(error);
        })
      );
    }
    getUsers(): Observable<Person[]> {
      return this.http.get<Person[]>(`${this.apiUrl}/users`);
    }
  
    getUserById(id: number): Observable<Person> {
      return this.http.get<Person>(`${this.apiUrl}/users/${id}`).pipe(
        catchError(error => {
          console.error('Erro ao buscar usuário por ID:', error);
          return throwError(error);
        })
      );
    }
}
