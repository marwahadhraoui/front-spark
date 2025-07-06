import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { environment } from '../../../../../environment';
import { User } from '../../../../Model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiBaseUrl}/api/users`;
  
   private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  
  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        return throwError(() => new Error('Failed to fetch users'));
      })
    );
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error deleting user:', error);
        return throwError(() => new Error('Failed to delete user'));
      })
    );
  } 

  createUser(user:User):Observable<User>{
    return this.http.post<User>(
      this.apiUrl,user
    );
  }

  updateUser(user:User):Observable<User>{
    return this.http.put<User>(this.apiUrl,user);
  }

  getUserByUserId(userId:number):Observable<User>{
    return this.http.get<User>(`${this.apiUrl}/${userId}`)
  }

}
  

 


