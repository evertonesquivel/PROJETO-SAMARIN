import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person } from '../../models/person.model';
import { LoginService } from '../auth/login.service'; // Importar o LoginService para acessar o token
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MainSectionService {
  private apiUrl = 'http://localhost:3000'; // URL da sua API backend

  constructor(private http: HttpClient, private loginService: LoginService) {}

  getUserProfile(): Observable<any> {
    const token = this.loginService.getToken();

    // Adiciona o token no cabeçalho da requisição
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.apiUrl}/profile`, { headers });
  }

  getAllUsers(): Observable<any> {
    const token = this.loginService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.apiUrl}/users`, { headers });
  }
  getUsers(): Observable<Person[]> {
    return this.http.get<Person[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}`);
  }

  like(personId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${personId}/like`, {});
  }

  dislike(personId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${personId}/dislike`, {});
  }
}
