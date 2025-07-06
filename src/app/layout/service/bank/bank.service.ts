import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environment';
import { catchError, Observable, throwError } from 'rxjs';
import { Bank } from '../../../../Model/bank';
@Injectable({
  providedIn: 'root'
})
export class BankService {
private http = inject(HttpClient)
  private apiUrl = `${environment.apiBaseUrl}/api/banks`;

  constructor() { }

  getBanks(): Observable<Bank[]> {
    return this.http.get<Bank[]>(this.apiUrl).pipe(
      catchError(error => {
        return throwError(() => new Error('failed to fetch banks'))
      })
    );
  }

  createBank(bank: Bank): Observable<Bank> {
    return this.http.post<Bank>(this.apiUrl, bank);
  }

  updateBank(bank: Bank): Observable<Bank> {
    return this.http.put<Bank>(this.apiUrl, bank)
  }

  getBankById(bankId: number): Observable<Bank> {
    return this.http.get<Bank>(`${this.apiUrl}/${bankId}`);
  }
  deleteBank(bankId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${bankId}`)
  }
}
