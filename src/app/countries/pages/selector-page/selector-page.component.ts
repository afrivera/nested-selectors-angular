import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { SmallCountry } from '../../../interfaces/countries.interface';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  myForm: FormGroup = this.fb.group({
    region : [ '', Validators.required ],
    country: ['', Validators.required ],
    border : ['', Validators.required ],
  });

  
  // fill selectors
  regions  : string[] = [];
  countries: SmallCountry [] = [];
  borders  : string [] = []

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) { }

  ngOnInit(): void {
    this.regions = this.countriesService.regions;

    // when change the region
    this.myForm.get('region')?.valueChanges
      .pipe(
        tap( ( _ ) => this.myForm.get( 'country' )?.reset('')),
        switchMap( region => this.countriesService.getCountriesByRegion( region ))
      )
      .subscribe( countries => this.countries = countries);
    // this.myForm.get('region')?.valueChanges
    //   .subscribe( region =>{
    //     console.log(region);
    //     this.countriesService.getCountriesByRegion( region )
    //       .subscribe( countries => {
    //         this.countries = countries;
    //       } )
    //   })

    // when change the country
    this.myForm.get('country')?.valueChanges
        .pipe(
          switchMap( code => this.countriesService.getCountriesByCode( code ))
        )
        .subscribe( country => {
          // this.borders = country?.['borders'] || [];
          console.log( country )
        })
         
    
  }

  save(){
    
  }
}
