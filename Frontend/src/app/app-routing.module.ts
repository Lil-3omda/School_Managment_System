import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { UnauthorizedComponent } from './shared/components/navbar/unauthorized';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard],
    data: { role: '1' } // Admin role
  },
  {
    path: 'teacher',
    loadChildren: () => import('./features/teacher/teacher.module').then(m => m.TeacherModule),
    canActivate: [AuthGuard],
    data: { role: '2' } // Teacher role
  },
  {
    path: 'student',
    loadChildren: () => import('./features/student/student.module').then(m => m.StudentModule),
    canActivate: [AuthGuard],
    data: { role: '3' } // Student role
  },
  {
    path: 'unauthorized',
   component: UnauthorizedComponent
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }