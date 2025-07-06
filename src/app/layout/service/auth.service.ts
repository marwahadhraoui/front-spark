import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

//  set Token(token : string){
//   localStorage.setItem('access_token',token);
//  }
  
//   private storeTokens(response: { access_token: string, refresh_token: string }) {
//     localStorage.setItem('access_token', response.access_token);
//     localStorage.setItem('refresh_token', response.refresh_token);
//   }
//   getToken(): string | null {
//     return localStorage.getItem('access_token');
//   }

//   logout(): void {
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('refresh_token');
//   }

//   getAuthHeaders(): { headers: HttpHeaders } {
//     const token = this.getToken();
//     return {
//       headers: new HttpHeaders({
//         Authorization: `Bearer ${token}`,
//         'content-type': 'application/json'
//       })
//     };
//   }
//   isLoggedIn():boolean{
//     return !!localStorage.getItem('access_token');
//   }
 
}



