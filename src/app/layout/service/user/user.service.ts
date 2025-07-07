import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { environment } from '../../../../../environment';
import { User } from '../../../../Model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/api/users`;
    
  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      catchError(error => {
        return throwError(() => new Error('Failed to fetch users'));
      })
    );
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`).pipe(
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
  

 


