import { Routes } from '@angular/router';
import { TeacherDashboardComponent } from './dashboard/teacher-dashboard.component';
import { TeacherProfileComponent } from './pages/profile/profile.component';

export const teacherRoutes: Routes = [
  {
    path: 'dashboard',
    component: TeacherDashboardComponent
  },
  {
    path: 'profile',
    component: TeacherProfileComponent
  },
  {
    path: 'classes',
    loadComponent: () => import('./pages/classes/classes.component').then(m => m.TeacherClassesComponent)
  },
  {
    path: 'schedule',
    loadComponent: () => import('./pages/schedule/schedule.component').then(m => m.TeacherScheduleComponent)
  },
  {
    path: 'grades',
    loadComponent: () => import('./pages/grades/grades.component').then(m => m.TeacherGradesComponent)
  },
  {
    path: 'attendance',
    loadComponent: () => import('./pages/attendance/attendance.component').then(m => m.TeacherAttendanceComponent)
  },
  {
    path: 'exams',
    loadComponent: () => import('./pages/exams/exams.component').then(m => m.TeacherExamsComponent)
  },
  {
    path: 'salary',
    loadComponent: () => import('./pages/salary/salary.component').then(m => m.TeacherSalaryComponent)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];