import { Component, OnInit, EventEmitter, Output, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Supplier } from 'src/app/modules/shared/models/supplier';
import { SupplierService } from 'src/app/modules/shared/services/supplier.service';
import { ToastrService } from 'ngx-toastr';
import { CountryService } from '../../../services/country.service';
import { Country } from '../../../models/country';
import { computeStyle } from '@angular/animations/browser/src/util';
import { Currency } from '../../../models/currency';
import { CurrencyService } from '../../../services/currency.service';

@Component({
  selector: 'app-create-supplier',
  templateUrl: './create-supplier.component.html',
  styleUrls: ['./create-supplier.component.scss']
})
export class CreateSupplierComponent implements OnInit {
  supplierForm: FormGroup;
  countries: Array<Country>;
  currencies:Array<Currency>;
  currentCountry: Country;
  @ViewChild('close') closeCreateModal: ElementRef;
  @Output() createSupplier = new EventEmitter<Supplier>();

  constructor(
    private currencyService:CurrencyService,
    private countryService: CountryService,
    private service: SupplierService,
    private formBuilder: FormBuilder,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    $('#createSupplier').on('hidden.bs.modal', function() {
      $(this)
        .find('form')
        .trigger('reset');
    });
    this.supplierForm = this.formBuilder.group({
      name: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(10)])),
      fullName: new FormControl('', Validators.required),
      edrpou: new FormControl(''),
      country: new FormControl(''),
      currency: new FormControl('')
    });
    this.countryService.getEntities().subscribe(data => {
      this.countries = data;
    });
    this.currencyService.getEntities().subscribe(data => {
      this.currencies = data;
    });
  }

  get Countries(): string[] {
    return this.countries.map(e => e.name);
  }
  get Currencies(): string[] {
    return this.currencies.map(e => e.fullName);
  }

  clickSubmit() {
    if (this.supplierForm.invalid) {
      return;
    }
    const form = this.supplierForm.value;
    const supplier: Supplier={
      id:0,
      name: form.name,
      fullName: form.fullName,
      edrpou: form.edrpou,
      country: this.countries[this.Countries.findIndex(f => f === form.country)],
      currency: this.currencies[this.Currencies.findIndex(f => f === form.currency)]
    };
    console.dir(supplier);

    this.service.addEntity(supplier).subscribe(
      newSupplier => {
        this.createSupplier.next(newSupplier);
        this.toast.success('', 'Додано');
      },
      error => this.toast.error('Отакої', 'Щось пішло не так')
    );
    this.closeCreateModal.nativeElement.click();
  }
}