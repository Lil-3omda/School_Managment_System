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
    path: 'teachers',
    loadComponent: () => import('./pages/manage-teachers/manage-teachers.component').then(m => m.ManageTeachersComponent)
  },
  {
    path: 'classes',
    loadComponent: () => import('./pages/manage-classes/manage-classes.component').then(m => m.ManageClassesComponent)
  },
  {
    path: 'subjects',
    loadComponent: () => import('./pages/manage-subjects/manage-subjects.component').then(m => m.ManageSubjectsComponent)
  },
  {
    path: 'exams',
    loadComponent: () => import('./pages/manage-exams/manage-exams.component').then(m => m.ManageExamsComponent)
  },
  {
    path: 'attendance',
    loadComponent: () => import('./pages/attendance-reports/attendance-reports.component').then(m => m.AttendanceReportsComponent)
  },
  {
    path: 'salaries',
    loadComponent: () => import('./pages/manage-salaries/manage-salaries.component').then(m => m.ManageSalariesComponent)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full' 
  }
];