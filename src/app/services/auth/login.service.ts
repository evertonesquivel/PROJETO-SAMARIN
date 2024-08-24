import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Person } from '../../models/person.model';
import { MainSectionService } from '../../services/main-section.service'; // Verifique o caminho correto

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private mockUsers: Person[];

  constructor(private mainSectionService: MainSectionService) {
    this.mockUsers = this.mainSectionService.getPeople();
  }

  login(credentials: { username: string, password: string }): Observable<{ token: string }> {
    const user = this.mockUsers.find(u => u.nickname === credentials.username && u.password === credentials.password);
    if (user) {
      const token = `mock-token-${user.id}`; // Gerar um token fictício com base no ID do usuário
      localStorage.setItem('token', token); // Armazenar o token
      return of({ token });
    } else {
      return throwError(() => new Error('Credenciais inválidas'));
    }
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
