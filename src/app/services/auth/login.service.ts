import { Injectable, Inject, PLATFORM_ID, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { DataManagerService } from '../user-data/data-manager.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private injector: Injector, // Injeta o Injector
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  private get dataManagerService(): DataManagerService {
    return this.injector.get(DataManagerService); // Usa o Injector para resolver a dependência
}
  initializeApp(): Observable<void> {
    const authToken = this.getToken();
    const refreshToken = this.getRefreshToken();

    if (!authToken && refreshToken) {
      // Tenta renovar o token de acesso usando o refresh token
      return this.refreshAccessToken().pipe(
        switchMap(newToken => (newToken ? this.loadUserData() : of(undefined))),
        catchError(() => {
          this.logout();
          return of(undefined);
        })
      );
    } else if (authToken) {
      // Token ainda válido, carrega os dados do usuário
      return this.loadUserData();
    }
    return of(undefined);
  }

  // Método para carregar os dados do usuário após a renovação do token
  loadUserData(): Observable<void> {
    const token = this.getToken();
    if (token) {
      // Aqui você chamaria o serviço para buscar os dados do perfil com o token atualizado
      return this.dataManagerService.getUserProfile().pipe(map(() => undefined)); // Substitua com uma chamada ao serviço de perfil do usuário, se houver
    }
    return of(undefined);
  }

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
  isTokenExpired(token: string): boolean {
    if (!token) return true;

    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
}

}
