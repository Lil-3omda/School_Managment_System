import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: 'dashboard',
    component: AdminDashboardComponent
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full' 
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes), 
    ReactiveFormsModule,
    SharedModule,
    AdminDashboardComponent 
  ]
})
export class AdminModule { }
