import { Injectable, Inject, PLATFORM_ID, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { DataManagerService } from '../user-data/data-manager.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:3000';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  private userProfileSubject = new BehaviorSubject<any>(null);
  private injector: Injector;

  constructor(
    private http: HttpClient,
    injector: Injector, // Injeta o Injector
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.injector = injector;
  }

  private get dataManagerService(): DataManagerService {
    return this.injector.get(DataManagerService); // Obtém o DataManagerService manualmente
  }

  // Observable públicos
  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  get userProfile$(): Observable<any> {
    return this.userProfileSubject.asObservable();
  }

  initializeApp(): Observable<void> {
    return this.refreshAccessToken().pipe(
      switchMap((newToken) => {
        if (newToken) {
          return this.loadUserData();
        } else {
          this.isAuthenticatedSubject.next(false);
          return of(undefined);
        }
      }),
      catchError(() => {
        this.logout();
        return of(undefined);
      })
    );
  }

  private loadUserData(): Observable<void> {
    return this.dataManagerService.getUserProfile().pipe(
      tap((profile) => {
        this.userProfileSubject.next(profile);
        this.isAuthenticatedSubject.next(true);
      }),
      map(() => undefined)
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      switchMap((response: any) => {
        if (response?.accessToken && response?.refreshToken && response?.userId) {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('authToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            localStorage.setItem('userId', response.userId.toString());
          }
          console.log('Login bem-sucedido. Solicitando permissão para acessar a localização...');
          this.requestGeolocation(response.userId); // Solicita a localização após o login
          return this.loadUserData().pipe(map(() => response));
        }
        return of(response);
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
    this.isAuthenticatedSubject.next(false);
    this.userProfileSubject.next(null);
  }

  refreshAccessToken(): Observable<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return of(null);

    return this.http.post(`${this.apiUrl}/refresh-token`, { refreshToken }).pipe(
      switchMap((response: any) => {
        const newAccessToken = response.accessToken;
        if (newAccessToken && isPlatformBrowser(this.platformId)) {
          localStorage.setItem('authToken', newAccessToken);
          return this.loadUserData().pipe(map(() => newAccessToken));
        }
        return of(null);
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
      console.log('Solicitando permissão para acessar a localização...');

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Permissão concedida. Obtendo localização...');
          const { latitude, longitude } = position.coords;
          console.log('Localização obtida:', { latitude, longitude });

          this.updateLocation(userId, latitude, longitude).subscribe(
            () => console.log('Localização atualizada com sucesso.'),
            (error) => console.error('Erro ao atualizar localização:', error)
          );
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error('Permissão para acessar a localização foi negada pelo usuário.');
              break;
            case error.POSITION_UNAVAILABLE:
              console.error('Localização indisponível.');
              break;
            case error.TIMEOUT:
              console.error('Tempo limite excedido ao tentar obter a localização.');
              break;
            default:
              console.error('Erro ao obter localização:', error.message);
          }
        },
        {
          enableHighAccuracy: true, // Tenta obter a localização com alta precisão
          timeout: 5000, // Tempo limite de 5 segundos
          maximumAge: 0 // Não usa cache de localização
        }
      );
    } else {
      console.error('Geolocalização não é suportada pelo navegador.');
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