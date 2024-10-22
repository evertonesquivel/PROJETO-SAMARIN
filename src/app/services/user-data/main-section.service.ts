import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person } from '../../models/person.model'; 
import { LoginService } from '../auth/login.service'; 

@Injectable({
  providedIn: 'root',
})
export class MainSectionService {
  private apiUrl = 'http://localhost:3000/users';
  private urlLike ='http://localhost:3000/like';

  constructor(private http: HttpClient, private loginService: LoginService) {}

  getUsers(): Observable<Person[]> {
    return this.http.get<Person[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}`);
  }

  likeOrDislike(userId: number, targetUserId: number, like: boolean): Observable<any> {
    const body = { userId, targetUserId, like };
    return this.http.post(this.urlLike, body);
  }
}
