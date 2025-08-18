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
import { AttendanceService, AttendanceRecord } from '../../../../core/services/attendance.service';
import { ClassService, Class } from '../../../../core/services/class.service';
import { AttendanceDialogComponent, AttendanceDialogData } from '../../../../shared/components/dialogs/attendance-dialog/attendance-dialog.component';
import { User } from '../../../../core/models/user.model';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { TeacherService } from '../../../../core/services/teacher.service';

@Component({
  selector: 'app-teacher-attendance',
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
        <h1 class="h2">الحضور والغياب</h1>
        <button mat-raised-button color="primary" (click)="markAttendance()">
          <mat-icon>add</mat-icon>
          تسجيل حضور جديد
        </button>
      </div>

      <!-- Filters -->
      <mat-card class="filters-card mb-4">
        <mat-card-content>
          <form [formGroup]="filterForm" class="filter-form">
            <div class="row">
              <div class="col-md-3">
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
              
              <div class="col-md-3">
                <mat-form-field appearance="outline" class="w-100">
                  <mat-label>التاريخ</mat-label>
                  <input matInput [matDatepicker]="datePicker" formControlName="date" (dateChange)="onFilterChange()">
                  <mat-datepicker-toggle matSuffix [for]="datePicker"></mat-datepicker-toggle>
                  <mat-datepicker #datePicker></mat-datepicker>
                </mat-form-field>
              </div>
              
              <div class="col-md-3">
                <mat-form-field appearance="outline" class="w-100">
                  <mat-label>الحالة</mat-label>
                  <mat-select formControlName="status" (selectionChange)="onFilterChange()">
                    <mat-option value="">جميع الحالات</mat-option>
                    <mat-option value="1">حاضر</mat-option>
                    <mat-option value="2">غائب</mat-option>
                    <mat-option value="3">متأخر</mat-option>
                    <mat-option value="4">معذور</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
              
              <div class="col-md-3">
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

      <!-- Attendance Table -->
      <mat-card class="attendance-table-card">
        <mat-card-content>
          <div *ngIf="!loading; else loadingTemplate">
            <table mat-table [dataSource]="dataSource" matSort class="attendance-table">
              
              <!-- Student Name Column -->
              <ng-container matColumnDef="studentName">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>اسم الطالب</th>
                <td mat-cell *matCellDef="let record">
                  <div class="student-info">
                    <mat-icon class="student-icon">person</mat-icon>
                    {{ record.studentName }}
                  </div>
                </td>
              </ng-container>

              <!-- Class Name Column -->
              <ng-container matColumnDef="className">
                <th mat-header-cell *matHeaderCellDef>الصف</th>
                <td mat-cell *matCellDef="let record">
                  <div class="class-info">
                    <mat-icon class="class-icon">school</mat-icon>
                    {{ record.className }}
                  </div>
                </td>
              </ng-container>

              <!-- Date Column -->
              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>التاريخ</th>
                <td mat-cell *matCellDef="let record">
                  <div class="date-info">
                    <mat-icon class="date-icon">event</mat-icon>
                    {{ record.date | date:'shortDate':'ar' }}
                  </div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>الحالة</th>
                <td mat-cell *matCellDef="let record">
                  <span class="status-badge" [class]="getStatusClass(record.status)">
                    {{ getStatusText(record.status) }}
                  </span>
                </td>
              </ng-container>

              <!-- Remarks Column -->
              <ng-container matColumnDef="remarks">
                <th mat-header-cell *matHeaderCellDef>ملاحظات</th>
                <td mat-cell *matCellDef="let record">{{ record.remarks || '-' }}</td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>الإجراءات</th>
                <td mat-cell *matCellDef="let record">
                  <div class="action-buttons">
                    <button mat-icon-button color="primary" (click)="editAttendance(record)">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="deleteAttendance(record)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="attendance-row"></tr>
            </table>

            <div *ngIf="dataSource.data.length === 0" class="no-data">
              <mat-icon class="empty-icon">event_note</mat-icon>
              <p>لا توجد سجلات حضور</p>
              <button mat-raised-button color="primary" (click)="markAttendance()">
                تسجيل حضور جديد
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
        <p>جاري تحميل بيانات الحضور...</p>
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

    .attendance-table-card {
      .attendance-table {
        width: 100%;
        
        .mat-header-cell {
          font-weight: bold;
          color: #333;
          background-color: #f8f9fa;
        }
        
        .student-info,
        .class-info,
        .date-info {
          display: flex;
          align-items: center;
          gap: 8px;
          
          .student-icon,
          .class-icon,
          .date-icon {
            color: #1976d2;
            font-size: 18px;
          }
        }
        
        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .status-present { background: #4caf50; color: white; }
        .status-absent { background: #f44336; color: white; }
        .status-late { background: #ff9800; color: white; }
        .status-excused { background: #2196f3; color: white; }
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
export class TeacherAttendanceComponent implements OnInit {
  displayedColumns: string[] = ['studentName', 'className', 'date', 'status', 'remarks', 'actions'];
  dataSource = new MatTableDataSource<AttendanceRecord>();
  loading = false;
  currentUser: User | null = null;
  
  filterForm: FormGroup;
  classes: Class[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private authService: AuthService,
    private attendanceService: AttendanceService,
    private classService: ClassService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private teacherService: TeacherService
  ) {
    this.filterForm = this.fb.group({
      classId: [''],
      date: [''],
      status: ['']
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadAttendanceRecords();
        this.loadClasses();
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAttendanceRecords(): void {
    this.loading = true;
    
    const classId = this.filterForm.get('classId')?.value;
    const date = this.filterForm.get('date')?.value;
    
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
          this.attendanceService.getAttendanceRecords(1, 10, classId, date)
            .pipe(
              catchError(error => {
                console.error('Error loading attendance records:', error);
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

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onFilterChange(): void {
    this.loadAttendanceRecords();
  }

  markAttendance(): void {
    const dialogRef = this.dialog.open(AttendanceDialogComponent, {
      width: '600px',
      data: {
        students: [], // Load from API
        classes: this.classes,
        mode: 'add'
      } as AttendanceDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.attendanceService.createAttendanceRecord(result)
          .pipe(
            catchError(error => {
              console.error('Error creating attendance:', error);
              return of(null);
            })
          )
          .subscribe(response => {
            if (response) {
              this.loadAttendanceRecords();
            }
          });
      }
    });
  }

  editAttendance(record: AttendanceRecord): void {
    const dialogRef = this.dialog.open(AttendanceDialogComponent, {
      width: '600px',
      data: {
        attendance: record,
        students: [], // Load from API
        classes: this.classes,
        mode: 'edit'
      } as AttendanceDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.attendanceService.updateAttendanceRecord(record.id, result)
          .pipe(
            catchError(error => {
              console.error('Error updating attendance:', error);
              return of(null);
            })
          )
          .subscribe(response => {
            if (response) {
              this.loadAttendanceRecords();
            }
          });
      }
    });
  }

  deleteAttendance(record: AttendanceRecord): void {
    if (confirm('هل أنت متأكد من حذف سجل الحضور؟')) {
      this.attendanceService.deleteAttendanceRecord(record.id)
        .pipe(
          catchError(error => {
            console.error('Error deleting attendance:', error);
            return of(void 0);
          })
        )
        .subscribe(() => {
          this.loadAttendanceRecords();
        });
    }
  }

  getStatusText(status: number): string {
    const statuses = ['', 'حاضر', 'غائب', 'متأخر', 'معذور'];
    return statuses[status] || 'غير محدد';
  }

  getStatusClass(status: number): string {
    const classes = ['', 'status-present', 'status-absent', 'status-late', 'status-excused'];
    return classes[status] || '';
  }
}