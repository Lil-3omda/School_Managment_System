import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { LayoutComponent } from '../../../../shared/components/layout/layout.component';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';
import { StudentService } from '../../../../core/services/student.service';
import { AttendanceService } from '../../../../core/services/attendance.service';
import { Student } from '../../../../core/models/student.model';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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

interface Grade {
  id: number;
  studentId: number;
  studentName: string;
  subject: string;
  examType: string;
  score: number;
  totalScore: number;
  percentage: number;
  grade: string;
  date: Date;
}

interface AttendanceRecord {
  id: number;
  studentId: number;
  studentName: string;
  date: Date;
  status: number;
  remarks: string;
}

@Component({
  selector: 'app-teacher-classes',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatTabsModule,
    LayoutComponent,
    MatProgressSpinnerModule,
    
],
  template: `
    <app-layout>
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">صفوفي</h1>
        <button mat-raised-button color="primary" (click)="loadClasses()">
          <mat-icon>refresh</mat-icon>
          تحديث
        </button>
      </div>

      <div class="row">
        <div class="col-md-6 col-lg-4 mb-4" *ngFor="let class of classes">
          <mat-card class="class-card">
            <mat-card-header>
              <mat-card-title>{{ class.name }}</mat-card-title>
              <mat-card-subtitle>{{ class.subject }}</mat-card-subtitle>
            </mat-card-header>
            
            <mat-card-content>
              <div class="class-info">
                <div class="info-item">
                  <mat-icon class="info-icon">school</mat-icon>
                  <span><strong>المرحلة:</strong> {{ class.grade }}</span>
                </div>
                <div class="info-item">
                  <mat-icon class="info-icon">people</mat-icon>
                  <span><strong>عدد الطلاب:</strong> {{ class.studentsCount }}</span>
                </div>
                <div class="info-item">
                  <mat-icon class="info-icon">room</mat-icon>
                  <span><strong>القاعة:</strong> {{ class.room }}</span>
                </div>
                <div class="info-item">
                  <mat-icon class="info-icon">schedule</mat-icon>
                  <span><strong>الجدول:</strong></span>
                  <ul class="schedule-list">
                    <li *ngFor="let schedule of class.schedule">{{ schedule }}</li>
                  </ul>
                </div>
              </div>
            </mat-card-content>
            
            <mat-card-actions>
              <div class="action-buttons">
                <button mat-raised-button color="primary" (click)="viewStudents(class)">
                  <mat-icon>people</mat-icon>
                  عرض الطلاب
                </button>
                <button mat-raised-button color="accent" (click)="viewGrades(class)">
                  <mat-icon>grade</mat-icon>
                  الدرجات
                </button>
                <button mat-raised-button color="warn" (click)="viewAttendance(class)">
                  <mat-icon>event_available</mat-icon>
                  الحضور
                </button>
              </div>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>

      <!-- Class Details Modal -->
      <div *ngIf="selectedClass" class="class-details-overlay" (click)="closeClassDetails()">
        <mat-card class="class-details-modal" (click)="$event.stopPropagation()">
          <mat-card-header>
            <mat-card-title>{{ selectedClass.name }} - {{ currentView }}</mat-card-title>
            <button mat-icon-button (click)="closeClassDetails()">
              <mat-icon>close</mat-icon>
            </button>
          </mat-card-header>

          <mat-card-content>
            <mat-tab-group [(selectedIndex)]="selectedTabIndex">
              <!-- Students Tab -->
              <mat-tab label="الطلاب">
                <div class="tab-content">
                  <div class="table-responsive">
                    <table mat-table [dataSource]="studentsDataSource" class="students-table">
                      <ng-container matColumnDef="studentNumber">
                        <th mat-header-cell *matHeaderCellDef>رقم الطالب</th>
                        <td mat-cell *matCellDef="let student">{{ student.studentNumber }}</td>
                      </ng-container>

                      <ng-container matColumnDef="name">
                        <th mat-header-cell *matHeaderCellDef>الاسم</th>
                        <td mat-cell *matCellDef="let student">{{ student.user.fullName }}</td>
                      </ng-container>

                      <ng-container matColumnDef="email">
                        <th mat-header-cell *matHeaderCellDef>البريد الإلكتروني</th>
                        <td mat-cell *matCellDef="let student">{{ student.user.email }}</td>
                      </ng-container>

                      <ng-container matColumnDef="phone">
                        <th mat-header-cell *matHeaderCellDef>الهاتف</th>
                        <td mat-cell *matCellDef="let student">{{ student.user.phoneNumber }}</td>
                      </ng-container>

                      <tr mat-header-row *matHeaderRowDef="studentsColumns"></tr>
                      <tr mat-row *matRowDef="let row; columns: studentsColumns;"></tr>
                    </table>
                  </div>
                </div>
              </mat-tab>

              <!-- Grades Tab -->
              <mat-tab label="الدرجات">
                <div class="tab-content">
                  <div class="d-flex justify-content-between mb-3">
                    <h6>درجات الطلاب</h6>
                    <button mat-raised-button color="primary" (click)="addGrade()">
                      <mat-icon>add</mat-icon>
                      إضافة درجة
                    </button>
                  </div>
                  <div class="table-responsive">
                    <table mat-table [dataSource]="gradesDataSource" class="grades-table">
                      <ng-container matColumnDef="studentName">
                        <th mat-header-cell *matHeaderCellDef>اسم الطالب</th>
                        <td mat-cell *matCellDef="let grade">{{ grade.studentName }}</td>
                      </ng-container>

                      <ng-container matColumnDef="examType">
                        <th mat-header-cell *matHeaderCellDef>نوع الامتحان</th>
                        <td mat-cell *matCellDef="let grade">{{ grade.examType }}</td>
                      </ng-container>

                      <ng-container matColumnDef="score">
                        <th mat-header-cell *matHeaderCellDef>الدرجة</th>
                        <td mat-cell *matCellDef="let grade">{{ grade.score }}/{{ grade.totalScore }}</td>
                      </ng-container>

                      <ng-container matColumnDef="percentage">
                        <th mat-header-cell *matHeaderCellDef>النسبة</th>
                        <td mat-cell *matCellDef="let grade">{{ grade.percentage }}%</td>
                      </ng-container>

                      <ng-container matColumnDef="grade">
                        <th mat-header-cell *matHeaderCellDef>التقدير</th>
                        <td mat-cell *matCellDef="let grade">
                          <span class="grade-badge" [class]="getGradeClass(grade.grade)">
                            {{ grade.grade }}
                          </span>
                        </td>
                      </ng-container>

                      <ng-container matColumnDef="actions">
                        <th mat-header-cell *matHeaderCellDef>الإجراءات</th>
                        <td mat-cell *matCellDef="let grade">
                          <button mat-icon-button color="primary" (click)="editGrade(grade)">
                            <mat-icon>edit</mat-icon>
                          </button>
                          <button mat-icon-button color="warn" (click)="deleteGrade(grade)">
                            <mat-icon>delete</mat-icon>
                          </button>
                        </td>
                      </ng-container>

                      <tr mat-header-row *matHeaderRowDef="gradesColumns"></tr>
                      <tr mat-row *matRowDef="let row; columns: gradesColumns;"></tr>
                    </table>
                  </div>
                </div>
              </mat-tab>

              <!-- Attendance Tab -->
              <mat-tab label="الحضور">
                <div class="tab-content">
                  <div class="d-flex justify-content-between mb-3">
                    <h6>سجل الحضور</h6>
                    <button mat-raised-button color="primary" (click)="markAttendance()">
                      <mat-icon>add</mat-icon>
                      تسجيل حضور
                    </button>
                  </div>
                  <div class="table-responsive">
                    <table mat-table [dataSource]="attendanceDataSource" class="attendance-table">
                      <ng-container matColumnDef="studentName">
                        <th mat-header-cell *matHeaderCellDef>اسم الطالب</th>
                        <td mat-cell *matCellDef="let attendance">{{ attendance.studentName }}</td>
                      </ng-container>

                      <ng-container matColumnDef="date">
                        <th mat-header-cell *matHeaderCellDef>التاريخ</th>
                        <td mat-cell *matCellDef="let attendance">{{ attendance.date | date:'shortDate':'ar' }}</td>
                      </ng-container>

                      <ng-container matColumnDef="status">
                        <th mat-header-cell *matHeaderCellDef>الحالة</th>
                        <td mat-cell *matCellDef="let attendance">
                          <span class="status-badge" [class]="getAttendanceStatusClass(attendance.status)">
                            {{ getAttendanceStatusText(attendance.status) }}
                          </span>
                        </td>
                      </ng-container>

                      <ng-container matColumnDef="remarks">
                        <th mat-header-cell *matHeaderCellDef>ملاحظات</th>
                        <td mat-cell *matCellDef="let attendance">{{ attendance.remarks || '-' }}</td>
                      </ng-container>

                      <ng-container matColumnDef="actions">
                        <th mat-header-cell *matHeaderCellDef>الإجراءات</th>
                        <td mat-cell *matCellDef="let attendance">
                          <button mat-icon-button color="primary" (click)="editAttendance(attendance)">
                            <mat-icon>edit</mat-icon>
                          </button>
                        </td>
                      </ng-container>

                      <tr mat-header-row *matHeaderRowDef="attendanceColumns"></tr>
                      <tr mat-row *matRowDef="let row; columns: attendanceColumns;"></tr>
                    </table>
                  </div>
                </div>
              </mat-tab>
            </mat-tab-group>
          </mat-card-content>
        </mat-card>
      </div>

      <div *ngIf="classes.length === 0 && !loading" class="text-center py-5">
        <mat-icon class="empty-icon">school</mat-icon>
        <h5 class="text-muted">لا توجد صفوف مخصصة</h5>
        <p class="text-muted">لم يتم تخصيص أي صفوف لك بعد</p>
      </div>

      <div *ngIf="loading" class="text-center py-5">
        <mat-spinner></mat-spinner>
        <p class="mt-3">جاري تحميل البيانات...</p>
      </div>
    </app-layout>
  `,
  styles: [`
    .class-card {
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      height: 100%;
    }

    .class-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .info-item {
      display: flex;
      align-items: center;
      margin-bottom: 0.75rem;
      font-size: 0.9rem;
    }

    .info-icon {
      margin-left: 8px;
      color: #1976d2;
      font-size: 18px;
    }

    .schedule-list {
      list-style: none;
      padding-left: 0;
      margin: 0.25rem 0 0 1.5rem;
    }

    .schedule-list li {
      font-size: 0.8rem;
      color: #6c757d;
      margin-bottom: 0.25rem;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .action-buttons button {
      width: 100%;
    }

    .class-details-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .class-details-modal {
      width: 90%;
      max-width: 800px;
      max-height: 80vh;
      overflow-y: auto;
    }

    .tab-content {
      padding: 1rem 0;
    }

    .students-table,
    .grades-table,
    .attendance-table {
      width: 100%;
    }

    .grade-badge,
    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .grade-a { background: #4caf50; color: white; }
    .grade-b { background: #2196f3; color: white; }
    .grade-c { background: #ff9800; color: white; }
    .grade-d { background: #f44336; color: white; }

    .status-present { background: #4caf50; color: white; }
    .status-absent { background: #f44336; color: white; }
    .status-late { background: #ff9800; color: white; }
    .status-excused { background: #2196f3; color: white; }

    .empty-icon {
      font-size: 4rem;
      color: #ddd;
      margin-bottom: 1rem;
    }
  `]
})
export class TeacherClassesComponent implements OnInit {
  currentUser: User | null = null;
  classes: TeacherClass[] = [];
  loading = false;
  selectedClass: TeacherClass | null = null;
  currentView = '';
  selectedTabIndex = 0;

  // Data sources for tables
  studentsDataSource = new MatTableDataSource<Student>();
  gradesDataSource = new MatTableDataSource<Grade>();
  attendanceDataSource = new MatTableDataSource<AttendanceRecord>();

  // Table columns
  studentsColumns = ['studentNumber', 'name', 'email', 'phone'];
  gradesColumns = ['studentName', 'examType', 'score', 'percentage', 'grade', 'actions'];
  attendanceColumns = ['studentName', 'date', 'status', 'remarks', 'actions'];

  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private attendanceService: AttendanceService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadClasses();
      }
    });
  }

  loadClasses(): void {
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

  viewStudents(classData: TeacherClass): void {
    this.selectedClass = classData;
    this.currentView = 'الطلاب';
    this.selectedTabIndex = 0;
    this.loadStudentsForClass(classData.id);
  }

  viewGrades(classData: TeacherClass): void {
    this.selectedClass = classData;
    this.currentView = 'الدرجات';
    this.selectedTabIndex = 1;
    this.loadGradesForClass(classData.id);
  }

  viewAttendance(classData: TeacherClass): void {
    this.selectedClass = classData;
    this.currentView = 'الحضور';
    this.selectedTabIndex = 2;
    this.loadAttendanceForClass(classData.id);
  }

  closeClassDetails(): void {
    this.selectedClass = null;
    this.currentView = '';
  }

  private loadStudentsForClass(classId: number): void {
    // Mock data - replace with actual API call
    const mockStudents: Student[] = [
      {
        id: 1,
        userId: 1,
        studentNumber: 'S001',
        enrollmentDate: new Date(),
        classId: classId,
        className: 'الصف الثالث أ',
        guardianName: 'أحمد محمد',
        guardianPhone: '0501234567',
        guardianEmail: 'guardian1@example.com',
        user: {
          id: 1,
          firstName: 'محمد',
          lastName: 'أحمد',
          email: 'student1@school.com',
          phoneNumber: '0501234567',
          dateOfBirth: new Date('2005-01-01'),
          gender: 1,
          address: 'الرياض',
          role: 3,
          isActive: true,
          fullName: 'محمد أحمد',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    this.studentsDataSource.data = mockStudents;
  }

  private loadGradesForClass(classId: number): void {
    // Mock data - replace with actual API call
    const mockGrades: Grade[] = [
      {
        id: 1,
        studentId: 1,
        studentName: 'محمد أحمد',
        subject: 'الرياضيات',
        examType: 'امتحان نصفي',
        score: 85,
        totalScore: 100,
        percentage: 85,
        grade: 'A',
        date: new Date()
      }
    ];
    this.gradesDataSource.data = mockGrades;
  }

  private loadAttendanceForClass(classId: number): void {
    // Mock data - replace with actual API call
    const mockAttendance: AttendanceRecord[] = [
      {
        id: 1,
        studentId: 1,
        studentName: 'محمد أحمد',
        date: new Date(),
        status: 1, // Present
        remarks: 'حضور منتظم'
      }
    ];
    this.attendanceDataSource.data = mockAttendance;
  }

  addGrade(): void {
    console.log('Add grade for class:', this.selectedClass);
  }

  editGrade(grade: Grade): void {
    console.log('Edit grade:', grade);
  }

  deleteGrade(grade: Grade): void {
    if (confirm('هل أنت متأكد من حذف هذه الدرجة؟')) {
      console.log('Delete grade:', grade);
    }
  }

  markAttendance(): void {
    console.log('Mark attendance for class:', this.selectedClass);
  }

  editAttendance(attendance: AttendanceRecord): void {
    console.log('Edit attendance:', attendance);
  }

  getGradeClass(grade: string): string {
    switch (grade) {
      case 'A': case 'A+': return 'grade-a';
      case 'B': case 'B+': return 'grade-b';
      case 'C': case 'C+': return 'grade-c';
      default: return 'grade-d';
    }
  }

  getAttendanceStatusText(status: number): string {
    const statuses = ['', 'حاضر', 'غائب', 'متأخر', 'معذور'];
    return statuses[status] || 'غير محدد';
  }

  getAttendanceStatusClass(status: number): string {
    const classes = ['', 'status-present', 'status-absent', 'status-late', 'status-excused'];
    return classes[status] || '';
  }
}