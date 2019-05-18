import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '../../models/user';
import { Supplier } from '../../models/supplier';
import { SupplierService } from '../../services/supplier.service';

declare const $;

@Component({
  selector: 'app-issue-log-suppliers',
  templateUrl: './issue-log-suppliers.component.html',
  styleUrls: ['./issue-log-suppliers.component.scss']
})
export class IssueLogSuppliersComponent implements OnInit {

  currentSupplier: Supplier;
  suppliers: Array<Supplier>;
  @Output() selectSupplier: EventEmitter<Supplier>;

  constructor(private supplierService: SupplierService) {
    this.selectSupplier = new EventEmitter<Supplier>();
  }

  ngOnInit() {
    this.supplierService.getEntities().subscribe(items => this.suppliers = items);
  }

  selectItem(item: Supplier): void {
    this.currentSupplier = item;
    this.selectSupplier.emit(item);
  }
}
