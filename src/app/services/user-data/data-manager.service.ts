import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Person } from '../../models/person.model';
import { LoginService } from '../auth/login.service';

@Injectable({
  providedIn: 'root',
})
export class DataManagerService {
  private apiUrl = 'http://localhost:3000'; // URL da API
  private apiLocation = 'http://localhost:3000/location'; // URL da API de localização
  private userImages: { userId: number, imageUrl: string }[] = []; // Atualize o tipo // Array para armazenar as imagens

  constructor(
    private http: HttpClient,
    private loginService: LoginService // Torna o LoginService opcional
  ) {}

  // Método para buscar as imagens do usuário e salvá-las temporariamente
  public fetchAndSaveUserImages(userId: number): Observable<{ userId: number, imageUrl: string }[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user-images/${userId}`).pipe(
      map(images => {
        const userImages = images.map((image, index) => {
          return { userId, imageUrl: image }; // Retorna a URL base64 diretamente
        });
  
        this.userImages = userImages;
        return userImages;
      }),
      catchError(error => {
        console.error('Erro ao buscar imagens do usuário:', error);
        return throwError(error);
      })
    );
  }

  // Método para converter base64 em arquivo de imagem
  private base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',');
    const match = arr[0].match(/:(.*?);/);
  
    if (!match) {
      throw new Error('Formato base64 inválido. O prefixo da imagem não foi encontrado.');
    }
  
    const mime = match[1]; // Extrai o tipo MIME (ex: image/jpeg)
    const bstr = atob(arr[1]); // Decodifica a string base64
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
  
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
  
    return new File([u8arr], filename, { type: mime });
  }

  // Método para obter as imagens salvas
  public getUserImages(): { userId: number, imageUrl: string }[] {
    return this.userImages;
  }

  // Métodos existentes...
  updateUserProfile(updatedData: any): Observable<any> {
    if (!this.loginService) {
      return throwError(() => new Error('LoginService não está disponível.'));
    }

    const token = this.loginService.getToken(); // Obtém o token do usuário logado
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` }); // Configura os headers com o token

    return this.http.put(`${this.apiUrl}/profile`, updatedData, { headers }).pipe(
      catchError(error => {
        console.error('Erro ao atualizar perfil:', error);
        return throwError(error);
      })
    );
  }

  getUserProfile(): Observable<any> {
    if (!this.loginService) {
      return throwError(() => new Error('LoginService não está disponível.'));
    }

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
    if (!this.loginService) {
      return throwError(() => new Error('LoginService não está disponível.'));
    }

    const token = this.loginService.getToken(); // Obtém o token do usuário logado
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` }); // Configura os headers com o token

    return this.http.get<Person[]>(`${this.apiUrl}/recommendations`, { headers }).pipe(
      catchError(error => {
        console.error('Erro ao buscar usuários:', error);
        return throwError(error);
      })
    );
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
    if (!this.loginService) {
      return throwError(() => new Error('LoginService não está disponível.'));
    }

    const token = this.loginService.getToken(); // Obter o token do usuário logado
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });

    return this.http.post<any>(this.apiLocation, { id: userId }, { headers }).pipe(
      catchError(error => {
        console.error('Erro ao buscar localização do usuário:', error);
        return throwError(error);
      })
    );
  }

  updateUserLocation(userId: number, latitude: number, longitude: number): Observable<any> {
    const token = this.loginService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.post(
      `${this.apiUrl}/update-location`,
      { latitude, longitude },
      { headers }
    ).pipe(
      catchError(error => {
        console.error('Erro ao atualizar localização:', error);
        return throwError(error);
      })
    );
  }

  updateFilterDistance(userId: number, filterDistance: number): Observable<any> {
    const token = this.loginService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.post(
      `${this.apiUrl}/update-filter-distance`,
      { filterDistance },
      { headers }
    ).pipe(
      catchError(error => {
        console.error('Erro ao atualizar distância de filtragem:', error);
        return throwError(error);
      })
    );
  }
  public uploadUserImages(userId: number, imageFiles: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('user_id', userId.toString());
    imageFiles.forEach((file, index) => {
      formData.append('images', file); // Adiciona cada imagem da galeria
    });
  
    return this.http.post(`${this.apiUrl}/upload-images`, formData).pipe(
      catchError(error => {
        console.error('Erro ao fazer upload das imagens:', error);
        return throwError(error);
      })
    );
  
  }

  // Método para enviar a imagem de perfil
public uploadProfileImage(userId: number, base64Image: string): Observable<any> {
  const payload = {
    user_id: userId,
    image: base64Image,
  };

  return this.http.post(`${this.apiUrl}/upload-profile-image`, payload).pipe(
    catchError(error => {
      console.error('Erro ao fazer upload da imagem de perfil:', error);
      return throwError(error);
    })
  );
}

// Método para enviar múltiplas imagens
public uploadImages(formData: FormData): Observable<any> {
  return this.http.post(`${this.apiUrl}/upload-images`, formData).pipe(
    catchError(error => {
      console.error('Erro ao fazer upload das imagens:', error);
      return throwError(error);
    })
  );
}
}