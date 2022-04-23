import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Country } from '../interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  constructor(private http: HttpClient) {}

  getCountry(country: string): Observable<Country[]> {
    return this.http
      .get<Country[]>(environment.restBaseURL + '/name/' + country)
      .pipe(catchError(() => of([])));
  }
}
