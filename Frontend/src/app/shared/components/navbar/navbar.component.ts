import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/models/user.model';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      // Re-init dropdown after user changes (important when login/logout happens)
      this.initDropdowns();
    });
  }

  ngAfterViewInit(): void {
    this.initDropdowns();
  }

  private initDropdowns(): void {
    const dropdownElementList = Array.from(document.querySelectorAll('.dropdown-toggle'));
    dropdownElementList.forEach(dropdownToggleEl => {
      new bootstrap.Dropdown(dropdownToggleEl);
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

  getProfileRoute(): string {
    if (this.isAdmin()) return '/admin/profile';
    if (this.isTeacher()) return '/teacher/profile';
    if (this.isStudent()) return '/student/profile';
    return '/';
  }
}
