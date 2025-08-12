import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports:[
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.redirectToDashboard();
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.loading = false;
          this.redirectToDashboard();
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'حدث خطأ في تسجيل الدخول';
        }
      });
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  fillDemoCredentials(role: string): void {
    const credentials = {
      admin: { email: 'admin@school.com', password: '123456' },
      teacher: { email: 'teacher@school.com', password: '123456' },
      student: { email: 'student@school.com', password: '123456' }
    };
    
    const cred = credentials[role as keyof typeof credentials];
    if (cred) {
      this.loginForm.patchValue(cred);
    }
  }

  private redirectToDashboard(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        switch (user.role) {
          case UserRole.Admin:
            this.router.navigate(['/admin/dashboard']);
            break;
          case UserRole.Teacher:
            this.router.navigate(['/teacher/dashboard']);
            break;
          case UserRole.Student:
            this.router.navigate(['/student/dashboard']);
            break;
          default:
            this.router.navigate(['/']);
        }
      }
    });
  }
}