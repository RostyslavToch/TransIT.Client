import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Vehicle } from '../../models/vehicle/vehicle';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VehicleType } from '../../models/vehicleType/vehicle-type';
import { VehicleTypeService } from '../../services/vehicle-type.service';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-edit-vehicle',
  templateUrl: './edit-vehicle.component.html',
  styleUrls: ['./edit-vehicle.component.scss']
})
export class EditVehicleComponent implements OnInit {
  @ViewChild('close') closeDiv: ElementRef;
  @Input()
  set vehicle(vehicle: Vehicle) {
    if (!vehicle) {
      return;
    }
    this.vehicleForm.patchValue({ ...vehicle, vehicleType: vehicle.vehicleType.name });
  }
  @Output() updateVehicle = new EventEmitter<Vehicle>();

  vehicleForm: FormGroup;
  vehicleTypeList: VehicleType[] = [];

  constructor(private formBuilder: FormBuilder, private serviceVehicleType: VehicleTypeService, private serviceVehicle: VehicleService) { }

  ngOnInit() {
    this.vehicleForm = this.formBuilder.group({
      vehicleType: ['', Validators.required],
      vincode: '',
      inventoryId: '',
      regNum: '',
      brand: '',
      model: ''
    });
    this.serviceVehicleType.getEntities().subscribe(data => (this.vehicleTypeList = data));
  }

  updateData() {
    if (this.vehicleForm.invalid) {
      return;
    }
    this.closeDiv.nativeElement.click();
    const form = this.vehicleForm.value;
    const vehicle: Vehicle = {
      id: 0,
      vehicleType: this.vehicleTypeList.find(t => t.name === form.vehicleType),
      vincode: form.vincode as string,
      inventoryId: form.inventoryId as string,
      regNum: form.regNum as string,
      brand: form.brand as string,
      model: form.model as string,
    };
    this.serviceVehicle.addEntity(vehicle).subscribe(_ => this.updateVehicle.next(vehicle));

  }
}
