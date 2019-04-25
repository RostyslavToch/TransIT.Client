import { Component, OnInit, ViewChild, Output, ElementRef, EventEmitter } from '@angular/core';
import { Malfunction } from '../../models/malfunc/malfunc';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MalfunSubgroup } from '../../models/malfun-subgroup/malfun-subgroup';
import { MalfuncGroup } from '../../models/malfuncGroup/malfunc-group';
import { MalfuncService } from '../../services/malfunc.service';
import { ToastrService } from 'ngx-toastr';
import { TEntity } from 'src/app/modules/core/models/entity/entity';
import { MalfuncGroupService } from '../../services/malfunc-group.service';
import { MalfunSubgroupService } from '../../services/malfun-subgroup.service';
@Component({
  selector: 'app-create-malfunc',
  templateUrl: './create-malfunc.component.html',
  styleUrls: ['./create-malfunc.component.scss']
})
export class CreateMalfuncComponent implements OnInit {
  @Output() createdMalfunction = new EventEmitter<Malfunction>();

  malfunctionForm: FormGroup;
  malfunctionSubgroupList: MalfunSubgroup[];
  malfunctionGroupList: MalfuncGroup[];
  malfunctions: Malfunction[];

  constructor(
    private serviceMalfunctionGroup: MalfuncGroupService,
    private serviceMalfunctionSubgroup: MalfunSubgroupService,
    private serviceMalfunction: MalfuncService,
    private formBuilder: FormBuilder,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    this.setUpForm();
    this.loadEntities();
  }

  onSubmit() {
    if (this.malfunctionForm.invalid) {
      return;
    }
    this.createMalfunction();
    this.setUpForm();
    this.hideModalWindow();
  }

  private get formValue() {
    return this.malfunctionForm.value;
  }

  get malfunctionSubgroupsFilteredByGroup(): MalfunSubgroup[] {
    const selectedGroup = this.formValue.group;
    const filteredSubgroups = this.filterSubgroupsByGroup(selectedGroup);
    return filteredSubgroups;
  }

  private filterSubgroupsByGroup(group: MalfuncGroup): MalfunSubgroup[] {
    const subgroups = this.malfunctionSubgroupList;
    if (!group) {
      return subgroups;
    }
    const filteredSubgroups = this.malfunctionSubgroupList.filter(
      subgroup => subgroup.malfunctionGroup.name === group.name
    );

    if (this.notSelectedSubgroup(filteredSubgroups)) {
      this.setDefaultSubgroup();
    }
    return filteredSubgroups;
  }
  private notSelectedSubgroup(subgroups: MalfunSubgroup[]): boolean {
    return subgroups.findIndex(s => s === this.formValue.subgroup) === -1;
  }

  private setDefaultSubgroup(): void {
    this.malfunctionForm.patchValue({ subgroup: '' });
  }

  clickSubmit(button: HTMLButtonElement) {
    button.click();
  }

  private setUpForm() {
    this.malfunctionForm = this.formBuilder.group({
      group: ['', Validators.required],
      subgroup: '',
      name: ['', Validators.required]
    });
  }
  private hideModalWindow() {
    const modalWindow: any = $('#createMalfunction');
    modalWindow.modal('hide');
  }

  private loadEntities() {
    this.serviceMalfunctionGroup.getEntities().subscribe(malfunctionGroupList => {
      this.malfunctionGroupList = malfunctionGroupList;
    });

    this.serviceMalfunction.getEntities().subscribe(malfunctions => {
      this.malfunctions = malfunctions;

      const allSubgroups = malfunctions.map(m => m.malfunctionSubgroup);
      this.malfunctionSubgroupList = Array.from(this.getDistinct(allSubgroups));

      // const allGroups = this.malfunctionSubgroupList.map(s => s.malfunctionGroup);
      // this.malfunctionGroupList = Array.from(this.getDistinct(allGroups));
    });
  }

  private getDistinct<T extends TEntity<T>>(entities: T[]) {
    return entities.filter((value, index, self) => self.findIndex(item => item.id === value.id) === index);
  }

  private createMalfunction() {
    const issue = new Malfunction(this.formValue);
    this.serviceMalfunction
      .addEntity(issue)
      .subscribe(
        newMalfunction => this.createdMalfunction.next(newMalfunction),
        _ => this.toast.error('Не вдалось створити заявку', 'Помилка створення заявки')
      );
  }
}
