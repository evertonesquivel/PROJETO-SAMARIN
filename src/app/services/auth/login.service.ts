import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
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
        if (response && response.accessToken && response.refreshToken && response.userId && isPlatformBrowser(this.platformId)) {
          localStorage.setItem('authToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('userId', response.userId.toString());
          this.requestGeolocation(response.userId);
        }
        return response;
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        this.http.post(`${this.apiUrl}/logout`, { refreshToken }).subscribe();
      }
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
    }
  }

  refreshAccessToken(): Observable<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return of(null);

    return this.http.post(`${this.apiUrl}/refresh-token`, { refreshToken }).pipe(
      map((response: any) => {
        const newAccessToken = response.accessToken;
        if (newAccessToken && isPlatformBrowser(this.platformId)) {
          localStorage.setItem('authToken', newAccessToken);
        }
        return newAccessToken;
      }),
      catchError(() => {
        this.logout();
        return of(null);
      })
    );
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

  private getRefreshToken(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem('refreshToken') : null;
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
