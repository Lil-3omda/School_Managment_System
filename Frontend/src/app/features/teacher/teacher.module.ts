import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { TeacherDashboardComponent } from './dashboard/teacher-dashboard.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: 'dashboard',
    component: TeacherDashboardComponent
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
    TeacherDashboardComponent 
  ]
})
export class TeacherModule {}
