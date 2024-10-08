import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:3000'; // URL da sua API backend

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      map((response: any) => {
        if (response && response.token && isPlatformBrowser(this.platformId)) {
          // Armazenar o token no localStorage para ser utilizado em outras requisições
          localStorage.setItem('authToken', response.token);
        }
        return response;
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken'); // Remove o token ao fazer logout
    }
  }

  isAuthenticated(): boolean {
    // Verifica se o token existe no localStorage
    return isPlatformBrowser(this.platformId) && !!localStorage.getItem('authToken');
  }

  getToken(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem('authToken') : null;
  }

  getUserProfile(): Observable<any> {
    const token = this.getToken(); // Assumindo que você tem um método para pegar o token
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  
    return this.http.get(`${this.apiUrl}/profile`, { headers });
  }
}
