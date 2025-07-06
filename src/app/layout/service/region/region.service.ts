import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../../environment';
import { Region } from '../../../../Model/region';

@Injectable({
  providedIn: 'root'
})
export class RegionService {
  private http = inject(HttpClient)
  private apiUrl = `${environment.apiBaseUrl}/api/regions`;

  constructor() { }

  getRegions(): Observable<Region[]> {
    return this.http.get<Region[]>(this.apiUrl).pipe(
      catchError(error => {
        return throwError(() => new Error('failed to fetch Regions'))
      })
    );
  }

  createRegion(region: Region): Observable<Region> {
    return this.http.post<Region>(this.apiUrl, region);
  }

  updateRegion(region: Region): Observable<Region> {
    return this.http.put<Region>(this.apiUrl, region)
  }

  getRegionById(regionId: number): Observable<Region> {
    return this.http.get<Region>(`${this.apiUrl}/${regionId}`);
  }
  deleteRegion(regionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${regionId}`)
  }
}


