import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink
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
      
      console.log('Attempting login with:', this.loginForm.value);
      
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.loading = false;
          this.redirectToDashboard();
        },
        error: (error) => {
          console.error('Login error:', error);
          this.loading = false;
          if (error.status === 0) {
            this.errorMessage = 'لا يمكن الاتصال بالخادم. تأكد من تشغيل الخادم';
          } else if (error.status === 401) {
            this.errorMessage = error.error?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
          } else if (error.status === 400) {
            this.errorMessage = error.error?.message || 'بيانات غير صحيحة';
          } else {
            this.errorMessage = error.error?.message || 'حدث خطأ في تسجيل الدخول';
          }
        }
      });
    } else {
      this.errorMessage = 'يرجى ملء جميع الحقول المطلوبة';
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