import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LayoutComponent } from '../../../../shared/components/layout/layout.component';
import { AuthService } from '../../../../core/services/auth.service';
import { GradeDialogComponent, GradeDialogData } from '../../../../shared/components/dialogs/grade-dialog/grade-dialog.component';
import { User } from '../../../../core/models/user.model';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { TeacherService } from '../../../../core/services/teacher.service';
import { ClassService } from '../../../../core/services/class.service';
import { StudentService } from '../../../../core/services/student.service';
import { GradeService } from '../../../../core/services/grade.service';
import { ExamService } from '../../../../core/services/exam.service';

interface Grade {
  id: number;
  studentId: number;
  studentName: string;
  examId: number;
  examName: string;
  subjectName: string;
  marksObtained: number;
  totalMarks: number;
  gradeValue: string;
  isPassed: boolean;
  remarks: string;
  examDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Exam {
  id: number;
  name: string;
  subjectName: string;
  className: string;
  totalMarks: number;
  examDate: Date;
}

interface Student {
  id: number;
  studentNumber: string;
  fullName: string;
  className: string;
}

@Component({
  selector: 'app-teacher-grades',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    LayoutComponent
  ],
  template: `
    <app-layout>
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">إدخال الدرجات</h1>
        <button mat-raised-button color="primary" (click)="addGrade()">
          <mat-icon>add</mat-icon>
          إضافة درجة جديدة
        </button>
      </div>

      <!-- Filters -->
      <mat-card class="filters-card mb-4">
        <mat-card-content>
          <form [formGroup]="filterForm" class="filter-form">
            <div class="row">
              <div class="col-md-4">
                <mat-form-field appearance="outline" class="w-100">
                  <mat-label>اختر الامتحان</mat-label>
                  <mat-select formControlName="examId" (selectionChange)="onFilterChange()">
                    <mat-option value="">جميع الامتحانات</mat-option>
                    <mat-option *ngFor="let exam of exams" [value]="exam.id">
                      {{ exam.name }} - {{ exam.subjectName }}
                    </mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
              
              <div class="col-md-4">
                <mat-form-field appearance="outline" class="w-100">
                  <mat-label>اختر الطالب</mat-label>
                  <mat-select formControlName="studentId" (selectionChange)="onFilterChange()">
                    <mat-option value="">جميع الطلاب</mat-option>
                    <mat-option *ngFor="let student of students" [value]="student.id">
                      {{ student.fullName }} - {{ student.studentNumber }}
                    </mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
              
              <div class="col-md-4">
                <mat-form-field appearance="outline" class="w-100">
                  <mat-label>البحث</mat-label>
                  <input matInput (keyup)="applyFilter($event)" placeholder="ابحث باسم الطالب">
                  <mat-icon matSuffix>search</mat-icon>
                </mat-form-field>
              </div>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Grades Table -->
      <mat-card class="grades-table-card">
        <mat-card-content>
          <div *ngIf="!loading; else loadingTemplate">
            <table mat-table [dataSource]="dataSource" matSort class="grades-table">
              
              <!-- Student Name Column -->
              <ng-container matColumnDef="studentName">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>اسم الطالب</th>
                <td mat-cell *matCellDef="let grade">
                  <div class="student-info">
                    <mat-icon class="student-icon">person</mat-icon>
                    {{ grade.studentName }}
                  </div>
                </td>
              </ng-container>

              <!-- Exam Name Column -->
              <ng-container matColumnDef="examName">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>الامتحان</th>
                <td mat-cell *matCellDef="let grade">
                  <div class="exam-info">
                    <mat-icon class="exam-icon">quiz</mat-icon>
                    <div>
                      <strong>{{ grade.examName }}</strong>
                      <br>
                      <small class="text-muted">{{ grade.subjectName }}</small>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Marks Column -->
              <ng-container matColumnDef="marks">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>الدرجة</th>
                <td mat-cell *matCellDef="let grade">
                  <div class="marks-info">
                    <span class="marks-obtained">{{ grade.marksObtained }}</span>
                    <span class="marks-separator">/</span>
                    <span class="total-marks">{{ grade.totalMarks }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Grade Value Column -->
              <ng-container matColumnDef="gradeValue">
                <th mat-header-cell *matHeaderCellDef>التقدير</th>
                <td mat-cell *matCellDef="let grade">
                  <span class="grade-badge" [class]="getGradeClass(grade.gradeValue)">
                    {{ grade.gradeValue }}
                  </span>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="isPassed">
                <th mat-header-cell *matHeaderCellDef>الحالة</th>
                <td mat-cell *matCellDef="let grade">
                  <span class="status-badge" [class]="grade.isPassed ? 'status-passed' : 'status-failed'">
                    {{ grade.isPassed ? 'نجح' : 'راسب' }}
                  </span>
                </td>
              </ng-container>

              <!-- Exam Date Column -->
              <ng-container matColumnDef="examDate">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>تاريخ الامتحان</th>
                <td mat-cell *matCellDef="let grade">
                  <div class="date-info">
                    <mat-icon class="date-icon">event</mat-icon>
                    {{ grade.examDate | date:'shortDate':'ar' }}
                  </div>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>الإجراءات</th>
                <td mat-cell *matCellDef="let grade">
                  <div class="action-buttons">
                    <button mat-icon-button color="primary" (click)="editGrade(grade)">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="deleteGrade(grade)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="grade-row"></tr>
            </table>

            <div *ngIf="dataSource.data.length === 0" class="no-data">
              <mat-icon class="empty-icon">grade</mat-icon>
              <p>لا توجد درجات مسجلة</p>
              <button mat-raised-button color="primary" (click)="addGrade()">
                إضافة درجة جديدة
              </button>
            </div>
          </div>

          <mat-paginator [pageSizeOptions]="[5, 10, 20]" 
                         showFirstLastButtons>
          </mat-paginator>
        </mat-card-content>
      </mat-card>
    </app-layout>

    <ng-template #loadingTemplate>
      <div class="loading-container">
        <mat-spinner></mat-spinner>
        <p>جاري تحميل بيانات الدرجات...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .filters-card {
      .filter-form {
        .mat-form-field {
          margin-bottom: 0;
        }
      }
    }

    .grades-table-card {
      .grades-table {
        width: 100%;
        
        .mat-header-cell {
          font-weight: bold;
          color: #333;
          background-color: #f8f9fa;
        }
        
        .student-info,
        .exam-info,
        .date-info {
          display: flex;
          align-items: center;
          gap: 8px;
          
          .student-icon,
          .exam-icon,
          .date-icon {
            color: #1976d2;
            font-size: 18px;
          }
        }
        
        .marks-info {
          font-weight: 600;
          font-size: 1.1rem;
          
          .marks-obtained {
            color: #1976d2;
          }
          
          .marks-separator {
            margin: 0 4px;
            color: #666;
          }
          
          .total-marks {
            color: #666;
          }
        }
        
        .grade-badge,
        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .grade-a { background: #4caf50; color: white; }
        .grade-b { background: #2196f3; color: white; }
        .grade-c { background: #ff9800; color: white; }
        .grade-d { background: #f44336; color: white; }
        
        .status-passed { background: #4caf50; color: white; }
        .status-failed { background: #f44336; color: white; }
      }
    }

    .no-data {
      text-align: center;
      padding: 3rem 1rem;
      
      .empty-icon {
        font-size: 4rem;
        color: #ddd;
        margin-bottom: 1rem;
      }
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 3rem 1rem;
    }
  `]
})
export class TeacherGradesComponent implements OnInit {
  displayedColumns: string[] = ['studentName', 'examName', 'marks', 'gradeValue', 'isPassed', 'examDate', 'actions'];
  dataSource = new MatTableDataSource<Grade>();
  loading = false;
  currentUser: User | null = null;
  
  filterForm: FormGroup;
  exams: Exam[] = [];
  students: Student[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private classService: ClassService,
    private studentService: StudentService,
    private gradeService: GradeService,
    private examService: ExamService
  ) {
    this.filterForm = this.fb.group({
      examId: [''],
      studentId: ['']
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadGrades();
        this.loadExams();
        this.loadStudents();
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadGrades(): void {
    this.loading = true;
    
    if (!this.currentUser) {
      this.loading = false;
      return;
    }

    this.teacherService.getTeacher(this.currentUser.id)
      .pipe(
        catchError(error => {
          console.error('Error loading teacher:', error);
          return of(null);
        })
      )
      .subscribe(teacher => {
        if (teacher) {
          // Load exams for this teacher first
          this.examService.getExamsByTeacher(teacher.id, 1, 100)
            .pipe(
              catchError(error => {
                console.error('Error loading teacher exams:', error);
                return of({ data: [], totalCount: 0, pageNumber: 1, pageSize: 100, totalPages: 0, hasPreviousPage: false, hasNextPage: false });
              })
            )
            .subscribe(examsResult => {
              // Load grades for each exam
              const allGrades: Grade[] = [];
              let completedRequests = 0;
              const totalExams = examsResult.data.length;
              
              if (totalExams === 0) {
                this.dataSource.data = [];
                this.loading = false;
                return;
              }
              
              examsResult.data.forEach(exam => {
                this.gradeService.getGradesByExam(exam.id, 1, 100)
                  .pipe(
                    catchError(error => {
                      console.error('Error loading grades for exam:', error);
                      return of({ data: [], totalCount: 0, pageNumber: 1, pageSize: 100, totalPages: 0, hasPreviousPage: false, hasNextPage: false });
                    })
                  )
                  .subscribe(gradesResult => {
                    allGrades.push(...gradesResult.data);
                    completedRequests++;
                    
                    if (completedRequests === totalExams) {
                      this.dataSource.data = allGrades;
                      this.loading = false;
                    }
                  });
              });
            });
        } else {
          this.loading = false;
        }
      });
  }

  loadExams(): void {
    if (!this.currentUser) return;

    this.teacherService.getTeacher(this.currentUser.id)
      .pipe(
        catchError(error => {
          console.error('Error loading teacher:', error);
          return of(null);
        })
      )
      .subscribe(teacher => {
        if (teacher) {
          this.examService.getExamsByTeacher(teacher.id, 1, 100)
            .pipe(
              catchError(error => {
                console.error('Error loading exams:', error);
                return of({ data: [], totalCount: 0, pageNumber: 1, pageSize: 100, totalPages: 0, hasPreviousPage: false, hasNextPage: false });
              })
            )
            .subscribe(result => {
              this.exams = result.data.map(exam => ({
                id: exam.id,
                name: exam.name,
                subjectName: exam.subjectName,
                className: exam.className,
                totalMarks: exam.totalMarks,
                examDate: new Date(exam.examDate)
              }));
            });
        }
      });
  }

  loadStudents(): void {
    if (!this.currentUser) return;

    this.teacherService.getTeacher(this.currentUser.id)
      .pipe(
        catchError(error => {
          console.error('Error loading teacher:', error);
          return of(null);
        })
      )
      .subscribe(teacher => {
        if (teacher) {
          this.classService.getClassesByTeacher(teacher.id)
            .pipe(
              catchError(error => {
                console.error('Error loading teacher classes:', error);
                return of([]);
              })
            )
            .subscribe(classes => {
              // Load students for each class
              const allStudents: Student[] = [];
              let completedRequests = 0;
              
              if (classes.length === 0) {
                this.students = [];
                return;
              }
              
              classes.forEach(cls => {
                this.studentService.getStudents(1, 100)
                  .pipe(
                    catchError(error => {
                      console.error('Error loading students:', error);
                      return of({ data: [], totalCount: 0, pageNumber: 1, pageSize: 100, totalPages: 0, hasPreviousPage: false, hasNextPage: false });
                    })
                  )
                  .subscribe(result => {
                    const classStudents = result.data.filter(student => student.classId === cls.id);
                    allStudents.push(...classStudents.map(student => ({
                      id: student.id,
                      studentNumber: student.studentNumber,
                      fullName: student.user.fullName,
                      className: student.className
                    })));
                    
                    completedRequests++;
                    if (completedRequests === classes.length) {
                      this.students = allStudents;
                    }
                  });
              });
            });
        }
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onFilterChange(): void {
    this.loadGrades();
  }

  addGrade(): void {
    const dialogRef = this.dialog.open(GradeDialogComponent, {
      width: '600px',
      data: {
        students: this.students,
        exams: this.exams,
        mode: 'add'
      } as GradeDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // TODO: Call API to create grade
        console.log('Creating grade:', result);
        this.loadGrades();
      }
    });
  }

  editGrade(grade: Grade): void {
    const dialogRef = this.dialog.open(GradeDialogComponent, {
      width: '600px',
      data: {
        grade: grade,
        students: this.students,
        exams: this.exams,
        mode: 'edit'
      } as GradeDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // TODO: Call API to update grade
        console.log('Updating grade:', result);
        this.loadGrades();
      }
    });
  }

  deleteGrade(grade: Grade): void {
    if (confirm(`هل أنت متأكد من حذف درجة ${grade.studentName}؟`)) {
      // TODO: Call API to delete grade
      console.log('Deleting grade:', grade);
      this.loadGrades();
    }
  }

  getGradeClass(grade: string): string {
    switch (grade) {
      case 'A': case 'A+': return 'grade-a';
      case 'B': case 'B+': return 'grade-b';
      case 'C': case 'C+': return 'grade-c';
      default: return 'grade-d';
    }
  }
}