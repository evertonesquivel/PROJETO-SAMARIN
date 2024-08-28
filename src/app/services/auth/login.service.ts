import { Injectable } from '@angular/core';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { Person } from '../../models/person.model';
import { MainSectionService } from '../user-data/main-section.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private mockUsers: Person[];
  private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());

  authStatus$ = this.authStatus.asObservable(); // Exponha como Observable

  constructor(private mainSectionService: MainSectionService) {
    this.mockUsers = this.mainSectionService.getPeople();
  }

  login(credentials: { username: string, password: string }): Observable<{ token: string, userId: number }> {
    const user = this.mockUsers.find(u => u.email === credentials.username && u.password === credentials.password);
    if (user) {
      const token = `mock-token-${user.id}`;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', user.id.toString());
      }
      this.authStatus.next(true); // Notifica a mudança de estado
      return of({ token, userId: user.id });
    } else {
      return throwError(() => new Error('Credenciais inválidas'));
    }
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }
    this.authStatus.next(false); // Notifica a mudança de estado
  }

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  getLoggedInUserId(): number | null {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('userId');
      return userId ? parseInt(userId, 10) : null;
    }
    return null;
  }
}
