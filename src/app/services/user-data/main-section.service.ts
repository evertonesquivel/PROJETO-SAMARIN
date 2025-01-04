import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable,throwError, catchError } from 'rxjs';
import { Person } from '../../models/person.model'; 
import { LoginService } from '../auth/login.service'; 

@Injectable({
  providedIn: 'root',
})
export class MainSectionService {
  private apiUrl = 'http://localhost:3000/users';
  private urlLike ='http://localhost:3000/like';

  constructor(private http: HttpClient, private loginService: LoginService) {}

  likeOrDislike(userId: number, targetUserId: number, like: boolean): Observable<any> {
    const body = { userId, targetUserId, like };
    return this.http.post(this.urlLike, body);
  }
}
