import { Component, OnInit, ChangeDetectorRef, Output, ViewChild, ElementRef } from '@angular/core';
import { User } from '../../models/user/user';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import { Role } from '../../models/role/role';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[];
  roleList: Role[];
  dataTable: DataTables.Api;
  user: User;

  private readonly tableParams: DataTables.Settings = {
    columnDefs: [
      {
        targets: [5, 7],
        orderable: false
      },
    ],
    scrollX: true,
    language: {
      url: '//cdn.datatables.net/plug-ins/1.10.19/i18n/Ukrainian.json'
    }
  };
  constructor(private service: UserService, private serviceRole: RoleService, private chRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.serviceRole.getEntities().subscribe(role => (this.roleList = role));
    this.service.getEntities().subscribe(users => {
      this.users = users;
      this.chRef.detectChanges();
      const table = $('table');
      this.dataTable = table.DataTable(this.tableParams);
    });
  }

  updateUser(user: User) {
    const index = this.users.findIndex(u => u.id === user.id);
    this.users[index] = user;
  //  $('#userTable').dataTable( ).

  }

  addUser(user: User) {
    this.users.push(user);
   // this.dataTable.data().ajax.reload();
  }

  deleteUser(user: User) {
    this.users = this.users.filter(u => u.id !== user.id);
    // this.dataTable.data().ajax.reload();
  }

  selectUser(userItem: User) {
    this.user = userItem;
  }
}
