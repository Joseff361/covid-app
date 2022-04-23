import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Status, Summary } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class CovidService {
  constructor(private http: HttpClient) {}

  public currentCountryData = new Subject<Status[]>();

  public getSummary(): Observable<Summary> {
    return this.http.get<Summary>(environment.covidBaseURL + '/summary').pipe(
      catchError(() => {
        return of({} as Summary);
      })
    );
  }

  public getCountryData(country: string, status: string): Observable<Status[]> {
    return this.http
      .get<Status[]>(
        environment.covidBaseURL +
          '/total/dayone/country/' +
          country +
          '/status/' +
          status
      )
      .pipe(catchError(() => of([])));
  }
}
