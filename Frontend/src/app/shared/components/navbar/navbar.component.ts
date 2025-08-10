import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports:[
    CommonModule,
    RouterModule
  ],
  
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  isAdmin(): boolean {
    return this.currentUser?.role === UserRole.Admin;
  }

  isTeacher(): boolean {
    return this.currentUser?.role === UserRole.Teacher;
  }

  isStudent(): boolean {
    return this.currentUser?.role === UserRole.Student;
  }

  getDashboardRoute(): string {
    if (this.isAdmin()) return '/admin/dashboard';
    if (this.isTeacher()) return '/teacher/dashboard';
    if (this.isStudent()) return '/student/dashboard';
    return '/';
  }
}