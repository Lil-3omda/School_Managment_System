import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LayoutComponent } from '../../../../shared/components/layout/layout.component';
import { AuthService } from '../../../../core/services/auth.service';
import { ExamService, Exam } from '../../../../core/services/exam.service';
import { ClassService, Class } from '../../../../core/services/class.service';
import { SubjectService, Subject } from '../../../../core/services/subject.service';
import { ExamDialogComponent, ExamDialogData } from '../../../../shared/components/dialogs/exam-dialog/exam-dialog.component';
import { User } from '../../../../core/models/user.model';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { TeacherService } from '../../../../core/services/teacher.service';

@Component({
  selector: 'app-teacher-exams',
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
    MatDatepickerModule,
    MatNativeDateModule,
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
        <h1 class="h2">الامتحانات</h1>
        <button mat-raised-button color="primary" (click)="createExam()">
          <mat-icon>add</mat-icon>
          إنشاء امتحان جديد
        </button>
      </div>

      <!-- Filters -->
      <mat-card class="filters-card mb-4">
        <mat-card-content>
          <form [formGroup]="filterForm" class="filter-form">
            <div class="row">
              <div class="col-md-4">
                <mat-form-field appearance="outline" class="w-100">
                  <mat-label>اختر الصف</mat-label>
                  <mat-select formControlName="classId" (selectionChange)="onFilterChange()">
                    <mat-option value="">جميع الصفوف</mat-option>
                    <mat-option *ngFor="let class of classes" [value]="class.id">
                      {{ class.name }}
                    </mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
              
              <div class="col-md-4">
                <mat-form-field appearance="outline" class="w-100">
                  <mat-label>اختر المادة</mat-label>
                  <mat-select formControlName="subjectId" (selectionChange)="onFilterChange()">
                    <mat-option value="">جميع المواد</mat-option>
                    <mat-option *ngFor="let subject of subjects" [value]="subject.id">
                      {{ subject.name }}
                    </mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
              
              <div class="col-md-4">
                <mat-form-field appearance="outline" class="w-100">
                  <mat-label>البحث</mat-label>
                  <input matInput (keyup)="applyFilter($event)" placeholder="ابحث بعنوان الامتحان">
                  <mat-icon matSuffix>search</mat-icon>
                </mat-form-field>
              </div>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Exams Table -->
      <mat-card class="exams-table-card">
        <mat-card-content>
          <div *ngIf="!loading; else loadingTemplate">
            <table mat-table [dataSource]="dataSource" matSort class="exams-table">
              
              <!-- Title Column -->
              <ng-container matColumnDef="title">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>عنوان الامتحان</th>
                <td mat-cell *matCellDef="let exam">
                  <div class="exam-title">
                    <mat-icon class="exam-icon">quiz</mat-icon>
                    <div>
                      <strong>{{ exam.title }}</strong>
                      <br>
                      <small class="text-muted">{{ exam.description }}</small>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Subject Column -->
              <ng-container matColumnDef="subjectName">
                <th mat-header-cell *matHeaderCellDef>المادة</th>
                <td mat-cell *matCellDef="let exam">
                  <div class="subject-info">
                    <mat-icon class="subject-icon">book</mat-icon>
                    {{ exam.subjectName }}
                  </div>
                </td>
              </ng-container>

              <!-- Class Column -->
              <ng-container matColumnDef="className">
                <th mat-header-cell *matHeaderCellDef>الصف</th>
                <td mat-cell *matCellDef="let exam">
                  <div class="class-info">
                    <mat-icon class="class-icon">school</mat-icon>
                    {{ exam.className }}
                  </div>
                </td>
              </ng-container>

              <!-- Exam Date Column -->
              <ng-container matColumnDef="examDate">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>تاريخ الامتحان</th>
                <td mat-cell *matCellDef="let exam">
                  <div class="date-info">
                    <mat-icon class="date-icon">event</mat-icon>
                    {{ exam.examDate | date:'shortDate':'ar' }}
                  </div>
                </td>
              </ng-container>

              <!-- Duration Column -->
              <ng-container matColumnDef="duration">
                <th mat-header-cell *matHeaderCellDef>المدة</th>
                <td mat-cell *matCellDef="let exam">
                  <div class="duration-info">
                    <mat-icon class="time-icon">schedule</mat-icon>
                    {{ formatDuration(exam.duration) }}
                  </div>
                </td>
              </ng-container>

              <!-- Total Marks Column -->
              <ng-container matColumnDef="totalMarks">
                <th mat-header-cell *matHeaderCellDef>الدرجة الكلية</th>
                <td mat-cell *matCellDef="let exam">
                  <div class="marks-info">
                    <mat-icon class="marks-icon">grade</mat-icon>
                    {{ exam.totalMarks }} درجة
                  </div>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>الإجراءات</th>
                <td mat-cell *matCellDef="let exam">
                  <div class="action-buttons">
                    <button mat-icon-button color="primary" (click)="viewExam(exam)">
                      <mat-icon>visibility</mat-icon>
                    </button>
                    <button mat-icon-button color="accent" (click)="editExam(exam)">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="deleteExam(exam)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="exam-row"></tr>
            </table>

            <div *ngIf="dataSource.data.length === 0" class="no-data">
              <mat-icon class="empty-icon">quiz</mat-icon>
              <p>لا توجد امتحانات مسجلة</p>
              <button mat-raised-button color="primary" (click)="createExam()">
                إنشاء امتحان جديد
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
        <p>جاري تحميل بيانات الامتحانات...</p>
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

    .exams-table-card {
      .exams-table {
        width: 100%;
        
        .mat-header-cell {
          font-weight: bold;
          color: #333;
          background-color: #f8f9fa;
        }
        
        .exam-title,
        .subject-info,
        .class-info,
        .date-info,
        .duration-info,
        .marks-info {
          display: flex;
          align-items: center;
          gap: 8px;
          
          .exam-icon,
          .subject-icon,
          .class-icon,
          .date-icon,
          .time-icon,
          .marks-icon {
            color: #1976d2;
            font-size: 18px;
          }
        }
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
export class TeacherExamsComponent implements OnInit {
  displayedColumns: string[] = ['title', 'subjectName', 'className', 'examDate', 'duration', 'totalMarks', 'actions'];
  dataSource = new MatTableDataSource<Exam>();
  loading = false;
  currentUser: User | null = null;
  
  filterForm: FormGroup;
  classes: Class[] = [];
  subjects: Subject[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private authService: AuthService,
    private examService: ExamService,
    private classService: ClassService,
    private subjectService: SubjectService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private teacherService: TeacherService
  ) {
    this.filterForm = this.fb.group({
      classId: [''],
      subjectId: ['']
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadExams();
        this.loadClasses();
        this.loadSubjects();
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadExams(): void {
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
          this.examService.getExamsByTeacher(teacher.id, 1, 10)
            .pipe(
              catchError(error => {
                console.error('Error loading exams:', error);
                return of({ data: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0, hasPreviousPage: false, hasNextPage: false });
              }),
              finalize(() => this.loading = false)
            )
            .subscribe(result => {
              this.dataSource.data = result.data;
            });
        } else {
          this.loading = false;
        }
      });
  }

  loadClasses(): void {
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
                console.error('Error loading classes:', error);
                return of([]);
              })
            )
            .subscribe(classes => {
              this.classes = classes;
            });
        }
      });
  }

  loadSubjects(): void {
    this.subjectService.getSubjects(1, 100)
      .pipe(
        catchError(error => {
          console.error('Error loading subjects:', error);
          return of({ items: [], totalCount: 0, pageNumber: 1, pageSize: 100, totalPages: 0 });
        })
      )
      .subscribe(result => {
        this.subjects = result.items;
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onFilterChange(): void {
    this.loadExams();
  }

  createExam(): void {
    const dialogRef = this.dialog.open(ExamDialogComponent, {
      width: '700px',
      data: {
        classes: this.classes,
        subjects: this.subjects,
        mode: 'add'
      } as ExamDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.examService.createExam(result)
          .pipe(
            catchError(error => {
              console.error('Error creating exam:', error);
              return of(null);
            })
          )
          .subscribe(response => {
            if (response) {
              this.loadExams();
            }
          });
      }
    });
  }

  viewExam(exam: Exam): void {
    const dialogRef = this.dialog.open(ExamDialogComponent, {
      width: '700px',
      data: {
        exam: exam,
        classes: this.classes,
        subjects: this.subjects,
        mode: 'view'
      } as ExamDialogData
    });
  }

  editExam(exam: Exam): void {
    const dialogRef = this.dialog.open(ExamDialogComponent, {
      width: '700px',
      data: {
        exam: exam,
        classes: this.classes,
        subjects: this.subjects,
        mode: 'edit'
      } as ExamDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.examService.updateExam(exam.id, result)
          .pipe(
            catchError(error => {
              console.error('Error updating exam:', error);
              return of(null);
            })
          )
          .subscribe(response => {
            if (response) {
              this.loadExams();
            }
          });
      }
    });
  }

  deleteExam(exam: Exam): void {
    if (confirm(`هل أنت متأكد من حذف الامتحان ${exam.title}؟`)) {
      this.examService.deleteExam(exam.id)
        .pipe(
          catchError(error => {
            console.error('Error deleting exam:', error);
            return of(void 0);
          })
        )
        .subscribe(() => {
          this.loadExams();
        });
    }
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} ساعة ${mins} دقيقة`;
    }
    return `${mins} دقيقة`;
  }
}