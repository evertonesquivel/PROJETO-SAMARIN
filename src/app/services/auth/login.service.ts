import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Person } from '../../models/person.model';
import { MainSectionService } from '../../services/main-section.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private mockUsers: Person[];

  constructor(private mainSectionService: MainSectionService) {
    this.mockUsers = this.mainSectionService.getPeople();
  }

  login(credentials: { username: string, password: string }): Observable<{ token: string }> {
    const user = this.mockUsers.find(u => u.email === credentials.username && u.password === credentials.password);
    if (user) {
      const token = `mock-token-${user.id}`;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
      return of({ token });
    } else {
      return throwError(() => new Error('Credenciais inválidas'));
    }
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false; // Ou uma lógica alternativa se localStorage não estiver disponível
  }
}
