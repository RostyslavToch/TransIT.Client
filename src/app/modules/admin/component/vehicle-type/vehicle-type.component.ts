import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { VehicleType } from 'src/app/modules/engineer/models/vehicleType';
import { VehicleTypeService } from '../../services/vehicle-type.service';

@Component({
  selector: 'app-vehicle-type',
  templateUrl: './vehicle-type.component.html',
  styleUrls: ['./vehicle-type.component.scss']
})
export class VehicleTypeComponent implements OnInit {
  vehicleTypes: VehicleType[] = [];
  table: DataTables.Api;
  selectedVehicleType: VehicleType;

  constructor(private vehicleTypeService: VehicleTypeService, private chRef: ChangeDetectorRef) { }

  private readonly tableConfig: DataTables.Settings = {
    responsive: true,
    columns: [
      { title: 'Тип транспорту' },
      { title: 'Дії', orderable: false }
    ],
    paging: true,
    scrollX: true,
    language: {
      url: '//cdn.datatables.net/plug-ins/1.10.19/i18n/Ukrainian.json'
    }
  };

  ngOnInit() {
    this.table = $('#vehicleTypes').DataTable(this.tableConfig);
    this.vehicleTypeService.getEntities().subscribe(vehicleTypes => {
      this.addTableData(vehicleTypes);
    });
  }

  addTableData(newVehicles: VehicleType[]) {
    this.vehicleTypes = [...newVehicles];
    const view = newVehicles.map(vehicle => this.vehicleToRow(vehicle));
    console.log(view);
    this.table.clear();
    this.table.rows.add(view).draw();

    $('#vehicles tbody')
      .off('click')
      .on('click', 'button[id^="vehicle"]', event => {
        const idTokens = event.currentTarget.id.split('-');
        const id = parseInt(idTokens[idTokens.length - 1], 10);
        console.log(id);
        this.selectedVehicleType = this.vehicleTypes.find(i => i.id === id);
      });

  }

  addVehicle(vehicleType: VehicleType) {
    this.vehicleTypes.push(vehicleType);
    this.table.row.add(this.vehicleToRow(vehicleType)).draw();
  }

  vehicleToRow(vehicleType: VehicleType): string[] {
    return [
      vehicleType.name,
      `<button id="vehicle-${vehicleType.id}" class="btn" data-toggle="modal" data-target="#editVehicle"><i class="fas fa-edit"></i></button>
     <button id="vehicle-${vehicleType.id}" class="btn" data-toggle="modal" data-target="#deleteVehicle"><i class="fas fas fa-trash-alt"></i></button>`
    ];
  }

}
