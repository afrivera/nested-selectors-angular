import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { Country, SmallCountry } from 'src/app/interfaces/countries.interface';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private baseUrl: string = 'https://restcountries.com/v2'
  private _regions: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']

  get regions(): string[]{
    return [ ...this._regions ];
  }

  constructor(
    private http: HttpClient
  ) { }

  getCountriesByRegion( region: string ): Observable<SmallCountry[]>{
    const url = `${ this.baseUrl }/region/${ region }?fields=alpha3Code,name`
    return this.http.get<SmallCountry[]>( url );
  }

  getCountriesByCode( code: string ): Observable<Country[] | null >{
    if(!code ){
      return of(null)
    }
    const url = `${ this.baseUrl }/alpha/${ code }`
    return this.http.get<Country[] | null>( url );
  }
}
