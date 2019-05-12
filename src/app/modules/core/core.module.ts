import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { HttpAuthInterceptor } from './interceptors/http-auth.interceptor';
import { CrudService } from './services/crud.service';
import { SpinnerService } from './services/spinner.service';
import { DictionaryComponent } from './shared/components/dictionary/dictionary.component';
import { CountryComponent } from './shared/components/dictionary/country/country.component';
import { CurrencyComponent } from './shared/components/dictionary/currency/currency.component';
import { CreteCountryComponent } from './shared/components/dictionary/country/crete-country/crete-country.component';
import { DeleteCountryComponent } from './shared/components/dictionary/country/delete-country/delete-country.component';
import { CreateCurrencyComponent } from './shared/components/dictionary/currency/create-currency/create-currency.component';
import { DeleteCurrencyComponent } from './shared/components/dictionary/currency/delete-currency/delete-currency.component';

@NgModule({
  declarations: [NavbarComponent, LoginComponent, DictionaryComponent, CountryComponent, CurrencyComponent, CreteCountryComponent, DeleteCountryComponent, CreateCurrencyComponent, DeleteCurrencyComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgBootstrapFormValidationModule, HttpClientModule],
  exports: [NavbarComponent, LoginComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpAuthInterceptor, multi: true },
    CrudService,
    SpinnerService
  ]
})
export class CoreModule {}
