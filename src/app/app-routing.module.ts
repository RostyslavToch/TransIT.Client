import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/core/components/login/login.component';
import { LoginGuard } from './modules/core/guards/login.guard';
import { AdminGuard } from './modules/core/guards/admin.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'admin',
    loadChildren: './modules/admin/admin.module#AdminModule'
    // canActivate: [AdminGuard]
  },
  {
    path: 'customer',
    loadChildren: './modules/register/register.module#RegisterModule'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
