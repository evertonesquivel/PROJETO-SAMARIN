import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      map((response: any) => {
        if (response && response.token && response.userId && isPlatformBrowser(this.platformId)) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('userId', response.userId.toString());
          this.requestGeolocation(response.userId);  // Agora atualiza sempre no login
        }
        return response;
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
    }
  }

  getUserId(): number | null {
    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('userId');
      return userId ? parseInt(userId, 10) : null;
    }
    return null;
  }

  isAuthenticated(): boolean {
    return isPlatformBrowser(this.platformId) && !!localStorage.getItem('authToken');
  }

  getToken(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem('authToken') : null;
  }

  getUserProfile(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(`${this.apiUrl}/profile`, { headers });
  }

  private requestGeolocation(userId: number): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          this.updateLocation(userId, latitude, longitude).subscribe();
        },
        error => console.error('Erro ao obter localização:', error)
      );
    }
  }

  private updateLocation(userId: number, latitude: number, longitude: number): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(`${this.apiUrl}/update-location`, { userId, latitude, longitude }, { headers });
  }
}
