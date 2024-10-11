import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Person } from '../../models/person.model'; 
import { LoginService } from '../auth/login.service'; 

@Injectable({
  providedIn: 'root',
})
export class MainSectionService {
  private apiUrl = 'http://localhost:3000/users'; // URL da API

  constructor(private http: HttpClient, private loginService: LoginService) {}

  // Método para obter todos os usuários
  getUsers(): Observable<Person[]> {
    return this.http.get<Person[]>(this.apiUrl); // Faz uma requisição GET para obter todos os usuários
  }

  // Método para obter um usuário específico por ID
  getUserById(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}`); // Faz uma requisição GET para obter um usuário pelo ID
  }

  // Temporariamente desativado: Curtir um usuário
  like(personId: number): Observable<void> {
    console.log(`Like dado no perfil com ID: ${personId}`);
    return of(); // Substitui a requisição por um observable vazio
  }

  // Temporariamente desativado: Descurtir um usuário
  dislike(personId: number): Observable<void> {
    console.log(`Dislike dado no perfil com ID: ${personId}`);
    return of(); // Substitui a requisição por um observable vazio
  }
}
