import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { ManageStudentsComponent } from './pages/manage-students/manage-students.component';

export const adminRoutes: Routes = [
  {
    path: 'dashboard',
    component: AdminDashboardComponent
  },
  {
    path: 'students',
    component: ManageStudentsComponent
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full' 
  }
];