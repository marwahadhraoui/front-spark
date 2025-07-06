import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environment';
import { catchError, Observable, throwError } from 'rxjs';
import { Area } from '../../../../Model/area';

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  private http = inject(HttpClient)
  private apiUrl = `${environment.apiBaseUrl}/api/areas`;

  constructor() { }

  getAreas(): Observable<Area[]> {
    return this.http.get<Area[]>(this.apiUrl).pipe(
      catchError(error => {
        return throwError(() => new Error('failed to fetch Areas'))
      })
    );
  }

  createArea(area: Area): Observable<Area> {
    return this.http.post<Area>(this.apiUrl, area);
  }

  updateArea(area: Area): Observable<Area> {
    return this.http.put<Area>(this.apiUrl, area)
  }

  getAreaById(areaId: number): Observable<Area> {
    return this.http.get<Area>(`${this.apiUrl}/${areaId}`);
  }
  deleteArea(areaId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${areaId}`)
  }
}
