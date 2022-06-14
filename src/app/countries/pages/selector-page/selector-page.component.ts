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
    country: [ '', Validators.required ],
    border : [ '', Validators.required ],
    // border : [ {value: '', disabled: true}, Validators.required ],
  });

  
  // fill selectors
  regions  : string[] = [];
  countries: SmallCountry [] = [];
  // borders  : string [] = []
  borders  : SmallCountry [] = []

  // ui
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) { }

  ngOnInit(): void {
    this.regions = this.countriesService.regions;

    // when change the region
    this.myForm.get('region')?.valueChanges
      .pipe(
        tap( ( _ ) =>{ 
          this.myForm.get( 'country' )?.reset('');
          // this.myForm.get( 'border')?.disable();
          this.loading = true;
        }),
        switchMap( region => this.countriesService.getCountriesByRegion( region ))
      )
      .subscribe( countries =>{
        this.countries = countries;
        this.loading = false;
      });
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
          tap(()=> {
            this.borders = [];
            this.myForm.get('border')?.reset('');
            // this.myForm.get( 'border')?.enable();
            this.loading = true;
          }),
          switchMap( code => this.countriesService.getCountriesByCode( code )),
          switchMap( country=> this.countriesService.getCountriesByCodes( country?.borders! ))
        )
        .subscribe( countries => {
          // this.borders = country?.['borders'] || [];
          // console.log( countries )
          this.borders = countries;
          this.loading = false;
        })
         
    
  }

  save(){
    
  }
}
