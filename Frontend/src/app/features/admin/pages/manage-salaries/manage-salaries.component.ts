import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { SalaryService, SalaryRecord } from '../../../../core/services/salary.service';
import { TeacherService, Teacher } from '../../../../core/services/teacher.service';
import { SalaryDialogComponent, SalaryDialogData } from '../../../../shared/components/dialogs/salary-dialog/salary-dialog.component';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-manage-salaries',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatTooltipModule,
    ReactiveFormsModule,
    NavbarComponent,
    MatSnackBarModule
  ],
  templateUrl: './manage-salaries.component.html',
  // styleUrls: ['./manage-salaries.component.scss']
})
export class ManageSalariesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['teacherName', 'month', 'year', 'baseSalary', 'bonus', 'deductions', 'totalSalary', 'paymentDate', 'status', 'actions'];
  dataSource = new MatTableDataSource<SalaryRecord>();
  loading = false;
  searchTerm = '';
  totalCount = 0;
  teachers: Teacher[] = [];
  filterForm: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private salaryService: SalaryService,
    private teacherService: TeacherService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.fb.group({
      teacherId: [null],
      month: [null],
      year: [new Date().getFullYear()]
    });
  }

  ngOnInit(): void {
    this.loadSalaries();
    this.loadTeachers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadSalaries(): void {
    this.loading = true;
    
    const teacherId = this.filterForm.get('teacherId')?.value;
    const month = this.filterForm.get('month')?.value;
    const year = this.filterForm.get('year')?.value;
    
    this.salaryService.getSalaryRecords(1, 10, teacherId, month, year)
      .pipe(
        catchError(error => {
          console.error('Error loading salaries:', error);
          return of({ data: [], items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0, hasPreviousPage: false, hasNextPage: false });
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(result => {
        this.dataSource.data = result.data || result.items || [];
        this.totalCount = result.totalCount;
      });
  }

  loadTeachers(): void {
    this.teacherService.getTeachers(1, 100)
      .pipe(
        catchError(error => {
          console.error('Error loading teachers:', error);
          return of({ data: [], items: [], totalCount: 0, pageNumber: 1, pageSize: 100, totalPages: 0, hasPreviousPage: false, hasNextPage: false });
        })
      )
      .subscribe(result => {
        this.teachers = result.data || result.items || [];
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data: SalaryRecord, filter: string) => {
      const searchTerm = filter.toLowerCase();
      return data.teacherName.toLowerCase().includes(searchTerm) ||
             this.getMonthText(data.month).toLowerCase().includes(searchTerm) ||
             data.year.toString().includes(searchTerm);
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onFilterChange(): void {
    this.loadSalaries();
  }

  addSalary(): void {
    const dialogRef = this.dialog.open(SalaryDialogComponent, {
      width: '700px',
      data: {
        teachers: this.teachers,
        mode: 'add'
      } as SalaryDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.salaryService.createSalaryRecord(result)
          .pipe(
            catchError(error => {
              console.error('Error creating salary:', error);
              return of(null);
            })
          )
          .subscribe(response => {
            if (response) {
              this.snackBar.open('تم إضافة الراتب بنجاح', 'إغلاق', { duration: 3000 });
              this.loadSalaries();
            }
          });
      }
    });
  }

  viewSalary(salary: SalaryRecord): void {
    const dialogRef = this.dialog.open(SalaryDialogComponent, {
      width: '700px',
      data: {
        salary: salary,
        teachers: this.teachers,
        mode: 'view'
      } as SalaryDialogData
    });
  }

  editSalary(salary: SalaryRecord): void {
    const dialogRef = this.dialog.open(SalaryDialogComponent, {
      width: '700px',
      data: {
        salary: salary,
        teachers: this.teachers,
        mode: 'edit'
      } as SalaryDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.salaryService.updateSalaryRecord(salary.id, result)
          .pipe(
            catchError(error => {
              console.error('Error updating salary:', error);
              return of(null);
            })
          )
          .subscribe(response => {
            if (response) {
              this.snackBar.open('تم تحديث الراتب بنجاح', 'إغلاق', { duration: 3000 });
              this.loadSalaries();
            }
          });
      }
    });
  }

  deleteSalary(salary: SalaryRecord): void {
    if (confirm(`هل أنت متأكد من حذف راتب ${salary.teacherName}؟`)) {
      this.salaryService.deleteSalaryRecord(salary.id)
        .pipe(
          catchError(error => {
            console.error('Error deleting salary:', error);
            return of(void 0);
          })
        )
        .subscribe(() => {
          this.snackBar.open('تم حذف الراتب بنجاح', 'إغلاق', { duration: 3000 });
          this.loadSalaries();
        });
    }
  }

  paySalary(salary: SalaryRecord): void {
    if (confirm(`هل تريد تأكيد دفع راتب ${salary.teacherName}؟`)) {
      this.salaryService.paySalary(salary.id)
        .pipe(
          catchError(error => {
            console.error('Error paying salary:', error);
            return of(salary);
          })
        )
        .subscribe(() => {
          this.snackBar.open('تم دفع الراتب بنجاح', 'إغلاق', { duration: 3000 });
          this.loadSalaries();
        });
    }
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
    const classes = ['', 'text-warning', 'text-success', 'text-danger'];
    return classes[status] || 'text-secondary';
  }

  exportSalaries(): void {
    // TODO: Implement export functionality
    console.log('Export salaries clicked');
  }
}