import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Status, Summary } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class CovidService {
  constructor(private http: HttpClient) {}

  getSummary(): Observable<Summary> {
    return this.http.get<Summary>(environment.baseURL + '/summary').pipe(
      catchError(() => {
        return of({} as Summary);
      })
    );
  }

  getCountryData(country: string): Observable<Status[]> {
    return this.http
      .get<Status[]>(
        environment.baseURL +
          '/country' +
          country +
          'status/confirmed?from=2020-03-01T00:00:00Z&to2022-04-19T00:00:00Z'
      )
      .pipe(catchError(() => of([])));
  }
}
