// src/app/services/data-manager.service.ts

import { LoginService } from '../auth/login.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Person } from '../../models/person.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataManagerService {
  private apiUrl = 'http://localhost:3000'; // URL da API
  private apiLocation = 'http://localhost:3000/location'; // URL da API de localização

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) { }

  // Método para atualizar o perfil do usuário
  updateUserProfile(updatedData: any): Observable<any> {
    const token = this.loginService.getToken(); // Obtém o token do usuário logado
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` }); // Configura os headers com o token

    return this.http.put(`${this.apiUrl}/profile`, updatedData, { headers }).pipe(
      catchError(error => {
        console.error('Erro ao atualizar perfil:', error);
        return throwError(error);
      })
    );
  }

  // Métodos existentes...
  getUserProfile(): Observable<any> {
    const token = this.loginService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    console.log("Token enviado na requisição:", token);

    return this.http.get(`${this.apiUrl}/profile`, { headers }).pipe(
      map((response: any) => response[0]),
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

  getLocationUser(userId: number): Observable<any> {
    const token = this.loginService.getToken(); // Obter o token do usuário logado
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });

    return this.http.post<any>(this.apiLocation, { id: userId }, { headers }).pipe(
      catchError(error => {
        console.error('Erro ao buscar localização do usuário:', error);
        return throwError(error);
      })
    );
  }
}