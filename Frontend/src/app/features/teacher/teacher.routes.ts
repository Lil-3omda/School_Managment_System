import { Routes } from '@angular/router';
import { TeacherDashboardComponent } from './dashboard/teacher-dashboard.component';

export const teacherRoutes: Routes = [
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