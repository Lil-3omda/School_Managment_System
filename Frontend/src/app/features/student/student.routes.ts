import { Routes } from '@angular/router';
import { StudentDashboardComponent } from './dashboard/student-dashboard.component';
import { StudentProfileComponent } from './pages/profile/profile.component';
import { StudentScheduleComponent } from './pages/schedule/schedule.component';
import { StudentGradesComponent } from './pages/grades/grades.component';
import { StudentAttendanceComponent } from './pages/attendance/attendance.component';
import { StudentExamsComponent } from './pages/exams/exams.component';

export const studentRoutes: Routes = [
  {
    path: 'dashboard',
    component: StudentDashboardComponent
  },
  {
    path: 'profile',
    component: StudentProfileComponent
  },
  {
    path: 'schedule',
    component: StudentScheduleComponent
  },
  {
    path: 'grades',
    component: StudentGradesComponent
  },
  {
    path: 'attendance',
    component: StudentAttendanceComponent
  },
  {
    path: 'exams',
    component: StudentExamsComponent
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];