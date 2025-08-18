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
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { AttendanceService, AttendanceRecord, AttendanceReport } from '../../../../core/services/attendance.service';
import { ClassService, Class } from '../../../../core/services/class.service';
import { AttendanceDialogComponent, AttendanceDialogData } from '../../../../shared/components/dialogs/attendance-dialog/attendance-dialog.component';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-attendance-reports',
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
    MatTooltipModule,
    ReactiveFormsModule,
    NavbarComponent,
    MatSnackBarModule
  ],
  templateUrl: './attendance-reports.component.html',
  // styleUrls: ['./attendance-reports.component.scss']
})
export class AttendanceReportsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['studentName', 'className', 'date', 'status', 'remarks', 'actions'];
  dataSource = new MatTableDataSource<AttendanceRecord>();
  loading = false;
  searchTerm = '';
  totalCount = 0;
  classes: Class[] = [];
  selectedClassId: number | null = null;
  selectedDate: Date | null = null;
  reportForm: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private attendanceService: AttendanceService,
    private classService: ClassService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.reportForm = this.fb.group({
      classId: [null],
      startDate: [null],
      endDate: [null]
    });
  }

  ngOnInit(): void {
    this.loadClasses();
    this.loadAttendanceRecords();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadClasses(): void {
    this.classService.getClasses(1, 100)
      .pipe(
        catchError(error => {
          console.error('Error loading classes:', error);
          return of({ items: [], totalCount: 0, pageNumber: 1, pageSize: 100, totalPages: 0 });
        })
      )
      .subscribe(result => {
        this.classes = result.items;
      });
  }

  loadAttendanceRecords(): void {
    this.loading = true;
    
    const classId = this.reportForm.get('classId')?.value;
    const startDate = this.reportForm.get('startDate')?.value;
    
    this.attendanceService.getAttendanceRecords(1, 10, classId, startDate)
      .pipe(
        catchError(error => {
          console.error('Error loading attendance records:', error);
          return of({ items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 });
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(result => {
        this.dataSource.data = result.items;
        this.totalCount = result.totalCount;
      });
  }

  generateReport(): void {
    const classId = this.reportForm.get('classId')?.value;
    const startDate = this.reportForm.get('startDate')?.value;
    const endDate = this.reportForm.get('endDate')?.value;

    if (!classId || !startDate || !endDate) {
      alert('يرجى اختيار الصف وتاريخ البداية والنهاية');
      return;
    }

    this.loading = true;
    this.attendanceService.getAttendanceReport(classId, startDate, endDate)
      .pipe(
        catchError(error => {
          console.error('Error generating report:', error);
          return of([]);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(reports => {
        // Handle the report data
        console.log('Attendance reports:', reports);
        // TODO: Display reports in a chart or summary view
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data: AttendanceRecord, filter: string) => {
      const searchTerm = filter.toLowerCase();
      return (data.studentName || '').toLowerCase().includes(searchTerm) ||
             data.className.toLowerCase().includes(searchTerm) ||
             (data.teacherName || '').toLowerCase().includes(searchTerm);
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onClassChange(): void {
    this.loadAttendanceRecords();
  }

  onDateChange(): void {
    this.loadAttendanceRecords();
  }

  getStatusText(status: number): string {
    const statuses = ['', 'حاضر', 'غائب', 'متأخر', 'معذور'];
    return statuses[status] || 'غير محدد';
  }

  getStatusClass(status: number): string {
    const classes = ['', 'text-success', 'text-danger', 'text-warning', 'text-info'];
    return classes[status] || 'text-secondary';
  }

  exportReport(): void {
    const filteredData = this.dataSource.filteredData;
    if (filteredData.length === 0) {
      alert('لا توجد بيانات للتصدير');
      return;
    }

    const csvContent = this.generateCSV(filteredData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `attendance-report-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  private generateCSV(data: AttendanceRecord[]): string {
    const headers = ['اسم الطالب', 'الصف', 'التاريخ', 'الحالة', 'ملاحظات'];
    const csvRows = [headers.join(',')];
    
    data.forEach(record => {
      const row = [
        record.studentName,
        record.className,
        new Date(record.date).toLocaleDateString('ar-SA'),
        this.getStatusText(record.status),
        record.remarks || ''
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
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
              this.snackBar.open('تم تحديث سجل الحضور بنجاح', 'إغلاق', { duration: 3000 });
              this.loadAttendanceRecords();
            }
          });
      }
    });
  }

  deleteAttendance(record: AttendanceRecord): void {
    if (confirm(`هل أنت متأكد من حذف سجل الحضور؟`)) {
      this.attendanceService.deleteAttendanceRecord(record.id)
        .pipe(
          catchError(error => {
            console.error('Error deleting attendance record:', error);
            return of(void 0);
          })
        )
        .subscribe(() => {
          this.snackBar.open('تم حذف سجل الحضور بنجاح', 'إغلاق', { duration: 3000 });
          this.loadAttendanceRecords();
        });
    }
  }
}