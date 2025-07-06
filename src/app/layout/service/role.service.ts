import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor() { }
  private apiUrl = `${environment.apiBaseUrl}/api/auth/roles`;
  private http = inject(HttpClient);
  getRoles():Observable<any[]>{

    return this.http.get<any[]>(this.apiUrl );
  }
  
}
