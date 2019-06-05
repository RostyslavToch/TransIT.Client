import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Vehicle } from 'src/app/modules/shared/models/vehicle';
import { VehicleType } from 'src/app/modules/shared/models/vehicleType';
import { VehicleTypeService } from 'src/app/modules/shared/services/vehicle-type.service';
import { VehicleService } from 'src/app/modules/shared/services/vehicle.service';
import { DatePipe } from '@angular/common';
import { NUM_FIELD_ERRORS, LET_NUM_FIELD_ERRORS } from 'src/app/custom-errors';

@Component({
  selector: 'app-edit-vehicle',
  templateUrl: './edit-vehicle.component.html',
  styleUrls: ['./edit-vehicle.component.scss'],
  providers: [DatePipe]
})
export class EditVehicleComponent implements OnInit {
  @Input()
  set vehicle(vehicle: Vehicle) {
    if (!vehicle) {
      return;
    }
    this.vehicleForm.patchValue({
      ...vehicle,
      vehicleType: vehicle.vehicleType.name,
      commissioningDate: this.datePipe.transform(vehicle.commissioningDate, 'yyyy-MM-dd'),
      warrantyEndDate: this.datePipe.transform(vehicle.warrantyEndDate, 'yyyy-MM-dd')
    });
  }

  constructor(
    private formBuilder: FormBuilder,
    private serviceVehicleType: VehicleTypeService,
    private serviceVehicle: VehicleService,
    private datePipe: DatePipe,
    private toast: ToastrService
  ) { }
  @ViewChild('close') closeDiv: ElementRef;
  @Output() updateVehicle = new EventEmitter<Vehicle>();

  vehicleForm: FormGroup;
  vehicleTypeList: VehicleType[] = [];

  CustomNumErrorMessages = NUM_FIELD_ERRORS;
  CustomLetNumErrorMessages = LET_NUM_FIELD_ERRORS;

  ngOnInit() {
    this.vehicleForm = this.formBuilder.group({
      id: '',
      vehicleType: new FormControl('', Validators.required),
      vincode: new FormControl('', Validators.compose([Validators.required, Validators.minLength(17), Validators.maxLength(17), Validators.pattern("^[A-Za-z0-9]+$")])),
      inventoryId: new FormControl('', Validators.pattern('^[0-9]+$')),
      regNum: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(15), Validators.pattern("^[A-Z0-9a-zА-Яа-яїієЇІЯЄ]+$")])),
      brand: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern("^[A-Z0-9a-zА-Яа-яїієЇІЯЄ]+$")])),
      model: new FormControl('', Validators.compose([Validators.minLength(1), Validators.maxLength(30)])),
      commissioningDate: new FormControl('', Validators.required),
      warrantyEndDate: new FormControl('', Validators.required)
    });
    this.serviceVehicleType.getEntities().subscribe(data => (this.vehicleTypeList = data.sort((a, b) => a.name.localeCompare(b.name))));
  }

  updateData() {
    if (this.vehicleForm.invalid) {
      return;
    }
    this.closeDiv.nativeElement.click();
    const form = this.vehicleForm.value;
    const vehicle: Vehicle = new Vehicle({
      id: form.id as number,
      vehicleType: this.vehicleTypeList.find(t => t.name === form.vehicleType),
      vincode: form.vincode as string,
      inventoryId: form.inventoryId as string,
      regNum: form.regNum as string,
      brand: form.brand as string,
      model: form.model as string,
      commissioningDate: form.commissioningDate as Date,
      warrantyEndDate: form.warrantyEndDate as Date
    });
    this.serviceVehicle
      .updateEntity(vehicle)
      .subscribe(
        data => this.updateVehicle.next(vehicle),
        _ => this.toast.error('Не вдалось редагувати дані про транспорт', 'Помилка редагування даних')
      );
  }
}
