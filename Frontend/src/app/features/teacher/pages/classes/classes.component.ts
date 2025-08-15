import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../../../shared/components/layout/layout.component';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';

interface TeacherClass {
  id: number;
  name: string;
  subject: string;
  grade: string;
  studentsCount: number;
  schedule: string[];
  room: string;
  semester: string;
  isActive: boolean;
}

@Component({
  selector: 'app-teacher-classes',
  standalone: true,
  imports: [
    CommonModule,
    LayoutComponent
  ],
  template: `
    <app-layout>
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">صفوفي</h1>
      </div>

      <div class="row">
        <div class="col-md-6 col-lg-4 mb-4" *ngFor="let class of classes">
          <div class="card h-100 class-card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">{{ class.name }}</h5>
              <span [class]="class.isActive ? 'badge bg-success' : 'badge bg-secondary'">
                {{ class.isActive ? 'نشط' : 'غير نشط' }}
              </span>
            </div>
            <div class="card-body">
              <div class="class-info">
                <div class="info-item">
                  <i class="fas fa-book text-primary me-2"></i>
                  <strong>المادة:</strong> {{ class.subject }}
                </div>
                <div class="info-item">
                  <i class="fas fa-layer-group text-primary me-2"></i>
                  <strong>الصف:</strong> {{ class.grade }}
                </div>
                <div class="info-item">
                  <i class="fas fa-users text-primary me-2"></i>
                  <strong>عدد الطلاب:</strong> {{ class.studentsCount }}
                </div>
                <div class="info-item">
                  <i class="fas fa-door-open text-primary me-2"></i>
                  <strong>القاعة:</strong> {{ class.room }}
                </div>
                <div class="info-item">
                  <i class="fas fa-calendar text-primary me-2"></i>
                  <strong>الجدول:</strong>
                  <ul class="schedule-list">
                    <li *ngFor="let schedule of class.schedule">{{ schedule }}</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <div class="btn-group w-100">
                <button class="btn btn-outline-primary btn-sm">
                  <i class="fas fa-eye me-1"></i>
                  عرض الطلاب
                </button>
                <button class="btn btn-outline-success btn-sm">
                  <i class="fas fa-edit me-1"></i>
                  الدرجات
                </button>
                <button class="btn btn-outline-info btn-sm">
                  <i class="fas fa-calendar-check me-1"></i>
                  الحضور
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="classes.length === 0" class="text-center py-5">
        <i class="fas fa-chalkboard fa-3x text-muted mb-3"></i>
        <h5 class="text-muted">لا توجد صفوف مخصصة</h5>
        <p class="text-muted">لم يتم تخصيص أي صفوف لك بعد</p>
      </div>
    </app-layout>
  `,
  styles: [`
    .class-card {
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease;
    }

    .class-card:hover {
      transform: translateY(-5px);
    }

    .info-item {
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    .schedule-list {
      list-style: none;
      padding-left: 0;
      margin-top: 0.25rem;
      margin-bottom: 0;
    }

    .schedule-list li {
      font-size: 0.8rem;
      color: #6c757d;
    }

    .btn-group .btn {
      font-size: 0.8rem;
    }
  `]
})
export class TeacherClassesComponent implements OnInit {
  currentUser: User | null = null;
  classes: TeacherClass[] = [];
  loading = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadClasses();
      }
    });
  }

  private loadClasses(): void {
    this.loading = true;
    // Mock data - replace with actual API call
    setTimeout(() => {
      this.classes = [
        {
          id: 1,
          name: 'الصف الثالث أ',
          subject: 'الرياضيات',
          grade: 'الثالث الثانوي',
          studentsCount: 25,
          schedule: ['الأحد 08:00', 'الثلاثاء 10:00', 'الخميس 09:00'],
          room: 'قاعة 101',
          semester: 'الفصل الأول',
          isActive: true
        },
        {
          id: 2,
          name: 'الصف الثاني ب',
          subject: 'الفيزياء',
          grade: 'الثاني الثانوي',
          studentsCount: 28,
          schedule: ['الاثنين 09:00', 'الأربعاء 11:00'],
          room: 'مختبر الفيزياء',
          semester: 'الفصل الأول',
          isActive: true
        }
      ];
      this.loading = false;
    }, 1000);
  }
}