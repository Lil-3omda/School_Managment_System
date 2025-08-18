import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { LayoutComponent } from '../../../../shared/components/layout/layout.component';
import { AuthService } from '../../../../core/services/auth.service';
import { SalaryService, SalaryRecord } from '../../../../core/services/salary.service';
import { User } from '../../../../core/models/user.model';
import { TeacherService } from '../../../../core/services/teacher.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-teacher-salary',
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
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    LayoutComponent
  ],
  template: `
    <app-layout>
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">الراتب</h1>
        <button mat-raised-button color="primary" (click)="loadSalaries()">
          <mat-icon>refresh</mat-icon>
          تحديث
        </button>
      </div>

      <!-- Summary Cards -->
      <div class="row mb-4">
        <div class="col-lg-3 col-md-6 mb-3">
          <mat-card class="summary-card bg-primary text-white">
            <mat-card-content>
              <div class="d-flex justify-content-between">
                <div>
                  <div class="text-white-50 small">الراتب الأساسي</div>
                  <div class="h4 mb-0">{{ salaryStats.baseSalary | currency:'SAR':'symbol':'1.0-0' }}</div>
                </div>
                <div class="align-self-center">
                  <mat-icon class="fa-2x">attach_money</mat-icon>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="col-lg-3 col-md-6 mb-3">
          <mat-card class="summary-card bg-success text-white">
            <mat-card-content>
              <div class="d-flex justify-content-between">
                <div>
                  <div class="text-white-50 small">إجمالي البدلات</div>
                  <div class="h4 mb-0">{{ salaryStats.totalAllowances | currency:'SAR':'symbol':'1.0-0' }}</div>
                </div>
                <div class="align-self-center">
                  <mat-icon class="fa-2x">add_circle</mat-icon>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="col-lg-3 col-md-6 mb-3">
          <mat-card class="summary-card bg-warning text-white">
            <mat-card-content>
              <div class="d-flex justify-content-between">
                <div>
                  <div class="text-white-50 small">إجمالي الخصومات</div>
                  <div class="h4 mb-0">{{ salaryStats.totalDeductions | currency:'SAR':'symbol':'1.0-0' }}</div>
                </div>
                <div class="align-self-center">
                  <mat-icon class="fa-2x">remove_circle</mat-icon>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="col-lg-3 col-md-6 mb-3">
          <mat-card class="summary-card bg-info text-white">
            <mat-card-content>
              <div class="d-flex justify-content-between">
                <div>
                  <div class="text-white-50 small">صافي الراتب</div>
                  <div class="h4 mb-0">{{ salaryStats.netSalary | currency:'SAR':'symbol':'1.0-0' }}</div>
                </div>
                <div class="align-self-center">
                  <mat-icon class="fa-2x">account_balance_wallet</mat-icon>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Filters -->
      <mat-card class="filters-card mb-4">
        <mat-card-content>
          <form [formGroup]="filterForm" class="filter-form">
            <div class="row">
              <div class="col-md-6">
                <mat-form-field appearance="outline" class="w-100">
                  <mat-label>الشهر</mat-label>
                  <mat-select formControlName="month" (selectionChange)="onFilterChange()">
                    <mat-option value="">جميع الأشهر</mat-option>
                    <mat-option value="1">يناير</mat-option>
                    <mat-option value="2">فبراير</mat-option>
                    <mat-option value="3">مارس</mat-option>
                    <mat-option value="4">أبريل</mat-option>
                    <mat-option value="5">مايو</mat-option>
                    <mat-option value="6">يونيو</mat-option>
                    <mat-option value="7">يوليو</mat-option>
                    <mat-option value="8">أغسطس</mat-option>
                    <mat-option value="9">سبتمبر</mat-option>
                    <mat-option value="10">أكتوبر</mat-option>
                    <mat-option value="11">نوفمبر</mat-option>
                    <mat-option value="12">ديسمبر</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
              
              <div class="col-md-6">
                <mat-form-field appearance="outline" class="w-100">
                  <mat-label>السنة</mat-label>
                  <input matInput type="number" formControlName="year" (input)="onFilterChange()" min="2020" max="2030">
                </mat-form-field>
              </div>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Salary Table -->
      <mat-card class="salary-table-card">
        <mat-card-content>
          <div *ngIf="!loading; else loadingTemplate">
            <table mat-table [dataSource]="dataSource" matSort class="salary-table">
              
              <!-- Month Column -->
              <ng-container matColumnDef="month">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>الشهر</th>
                <td mat-cell *matCellDef="let salary">
                  <div class="month-info">
                    <mat-icon class="month-icon">calendar_month</mat-icon>
                    {{ getMonthText(salary.month) }}
                  </div>
                </td>
              </ng-container>

              <!-- Year Column -->
              <ng-container matColumnDef="year">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>السنة</th>
                <td mat-cell *matCellDef="let salary">
                  <div class="year-info">
                    <mat-icon class="year-icon">calendar_today</mat-icon>
                    {{ salary.year }}
                  </div>
                </td>
              </ng-container>

              <!-- Base Salary Column -->
              <ng-container matColumnDef="baseSalary">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>الراتب الأساسي</th>
                <td mat-cell *matCellDef="let salary">
                  <div class="base-salary">
                    {{ salary.baseSalary | currency:'SAR':'symbol':'1.0-0' }}
                  </div>
                </td>
              </ng-container>

              <!-- Allowances Column -->
              <ng-container matColumnDef="allowances">
                <th mat-header-cell *matHeaderCellDef>البدلات</th>
                <td mat-cell *matCellDef="let salary">
                  <div class="allowances-info text-success">
                    +{{ salary.allowances | currency:'SAR':'symbol':'1.0-0' }}
                  </div>
                </td>
              </ng-container>

              <!-- Deductions Column -->
              <ng-container matColumnDef="deductions">
                <th mat-header-cell *matHeaderCellDef>الخصومات</th>
                <td mat-cell *matCellDef="let salary">
                  <div class="deductions-info text-danger">
                    -{{ salary.deductions | currency:'SAR':'symbol':'1.0-0' }}
                  </div>
                </td>
              </ng-container>

              <!-- Net Salary Column -->
              <ng-container matColumnDef="netSalary">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>صافي الراتب</th>
                <td mat-cell *matCellDef="let salary">
                  <div class="net-salary">
                    <strong>{{ salary.netSalary | currency:'SAR':'symbol':'1.0-0' }}</strong>
                  </div>
                </td>
              </ng-container>

              <!-- Payment Date Column -->
              <ng-container matColumnDef="paymentDate">
                <th mat-header-cell *matHeaderCellDef>تاريخ الدفع</th>
                <td mat-cell *matCellDef="let salary">
                  <div class="payment-date">
                    <mat-icon class="date-icon">event</mat-icon>
                    {{ salary.paymentDate | date:'shortDate':'ar' }}
                  </div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>الحالة</th>
                <td mat-cell *matCellDef="let salary">
                  <span class="status-badge" [class]="getStatusClass(salary.status)">
                    {{ getStatusText(salary.status) }}
                  </span>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="salary-row"></tr>
            </table>

            <div *ngIf="dataSource.data.length === 0" class="no-data">
              <mat-icon class="empty-icon">attach_money</mat-icon>
              <p>لا توجد سجلات رواتب</p>
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
        <p>جاري تحميل بيانات الرواتب...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .summary-card {
      border: none;
      border-radius: 12px;
      
      .mat-card-content {
        padding: 1.5rem;
      }
      
      .text-white-50 {
        opacity: 0.8;
      }
    }

    .filters-card {
      .filter-form {
        .mat-form-field {
          margin-bottom: 0;
        }
      }
    }

    .salary-table-card {
      .salary-table {
        width: 100%;
        
        .mat-header-cell {
          font-weight: bold;
          color: #333;
          background-color: #f8f9fa;
        }
        
        .month-info,
        .year-info,
        .payment-date {
          display: flex;
          align-items: center;
          gap: 8px;
          
          .month-icon,
          .year-icon,
          .date-icon {
            color: #1976d2;
            font-size: 18px;
          }
        }
        
        .base-salary,
        .net-salary {
          font-weight: 600;
          font-size: 1.1rem;
        }
        
        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .status-pending { background: #ff9800; color: white; }
        .status-paid { background: #4caf50; color: white; }
        .status-cancelled { background: #f44336; color: white; }
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
export class TeacherSalaryComponent implements OnInit {
  displayedColumns: string[] = ['month', 'year', 'baseSalary', 'allowances', 'deductions', 'netSalary', 'paymentDate', 'status'];
  dataSource = new MatTableDataSource<SalaryRecord>();
  loading = false;
  currentUser: User | null = null;
  
  filterForm: FormGroup;
  salaryStats = {
    baseSalary: 0,
    totalAllowances: 0,
    totalDeductions: 0,
    netSalary: 0
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private authService: AuthService,
    private salaryService: SalaryService,
    private fb: FormBuilder,
    private teacherService: TeacherService
  ) {
    this.filterForm = this.fb.group({
      month: [''],
      year: [new Date().getFullYear()]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadSalaries();
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadSalaries(): void {
    this.loading = true;
    
    const month = this.filterForm.get('month')?.value;
    const year = this.filterForm.get('year')?.value;
    
    this.teacherService.getTeacher(this.currentUser.id)
      .pipe(
        catchError(error => {
          console.error('Error loading teacher:', error);
          return of(null);
        })
      )
      .subscribe(teacher => {
        if (teacher) {
          this.salaryService.getTeacherSalaries(teacher.id, 1, 10)
            .pipe(
              catchError(error => {
                console.error('Error loading salaries:', error);
                return of({ data: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0, hasPreviousPage: false, hasNextPage: false });
              }),
              finalize(() => this.loading = false)
            )
            .subscribe(result => {
              this.dataSource.data = result.data;
              this.calculateSalaryStats(result.data);
            });
        } else {
          this.loading = false;
        }
      });
  }

  calculateSalaryStats(salaries: SalaryRecord[]): void {
    if (salaries.length > 0) {
      const latest = salaries[0];
      this.salaryStats = {
        baseSalary: latest.baseSalary,
        totalAllowances: latest.allowances,
        totalDeductions: latest.deductions,
        netSalary: latest.netSalary
      };
    }
  }

  onFilterChange(): void {
    this.loadSalaries();
  }

  getMonthText(month: number): string {
    const months = ['', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 
                   'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    return months[month] || month.toString();
  }

  getStatusText(status: number): string {
    const statuses = ['', 'قيد الانتظار', 'مدفوع', 'ملغي'];
    return statuses[status] || 'غير محدد';
  }

  getStatusClass(status: number): string {
    const classes = ['', 'status-pending', 'status-paid', 'status-cancelled'];
    return classes[status] || '';
  }
}