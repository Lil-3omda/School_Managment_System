import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { StudentService } from '../../../../core/services/student.service';
import { ClassService, Class } from '../../../../core/services/class.service';
import { Student, CreateStudentRequest } from '../../../../core/models/student.model';
import { StudentPaymentDialogComponent, StudentPaymentDialogData } from '../../../../shared/components/dialogs/student-payment-dialog/student-payment-dialog.component';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-manage-students',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    NavbarComponent
  ],
  templateUrl: './manage-students.component.html',
  styleUrls: ['./manage-students.component.scss']
})
export class ManageStudentsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['studentNumber', 'name', 'email', 'class', 'enrollmentDate', 'actions'];
  dataSource = new MatTableDataSource<Student>();
  loading = false;
  submitting = false;
  totalCount = 0;
  
  availableClasses: Class[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private studentService: StudentService,
    private classService: ClassService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadStudents();
    this.loadClasses();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadStudents(): void {
    this.loading = true;
    
    this.studentService.getStudents(1, 10)
      .pipe(
        catchError(error => {
          console.error('Error loading students:', error);
          this.snackBar.open('خطأ في تحميل بيانات الطلاب', 'إغلاق', { duration: 3000 });
          return of({ data: [], items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0, hasPreviousPage: false, hasNextPage: false });
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(result => {
        this.dataSource.data = result.data || result.items || [];
        this.totalCount = result.totalCount;
      });
  }

  loadClasses(): void {
    this.classService.getClasses(1, 100)
      .pipe(
        catchError(error => {
          console.error('Error loading classes:', error);
          return of({ data: [], items: [], totalCount: 0, pageNumber: 1, pageSize: 100, totalPages: 0, hasPreviousPage: false, hasNextPage: false });
        })
      )
      .subscribe(result => {
        this.availableClasses = result.data || result.items || [];
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data: Student, filter: string) => {
      const searchTerm = filter.toLowerCase();
      return data.user.firstName.toLowerCase().includes(searchTerm) ||
             data.user.lastName.toLowerCase().includes(searchTerm) ||
             data.user.fullName.toLowerCase().includes(searchTerm) ||
             data.user.email.toLowerCase().includes(searchTerm) ||
             data.studentNumber.toLowerCase().includes(searchTerm) ||
             data.className.toLowerCase().includes(searchTerm);
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addStudent(): void {
    const dialogRef = this.dialog.open(StudentPaymentDialogComponent, {
      width: '900px',
      data: {
        availableClasses: this.availableClasses,
        mode: 'add'
      } as StudentPaymentDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const studentData: CreateStudentRequest = {
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          phoneNumber: result.phoneNumber,
          dateOfBirth: result.dateOfBirth,
          gender: result.gender,
          address: result.address,
          studentNumber: result.studentNumber,
          enrollmentDate: result.enrollmentDate,
          classId: result.classId,
          guardianName: result.guardianName,
          guardianPhone: result.guardianPhone,
          guardianEmail: result.guardianEmail
        };
        
        this.studentService.createStudent(studentData)
          .pipe(
            catchError(error => {
              console.error('Error creating student:', error);
              this.snackBar.open('خطأ في إضافة الطالب', 'إغلاق', { duration: 3000 });
              return of(null);
            })
          )
          .subscribe(response => {
            if (response) {
              this.snackBar.open('تم إضافة الطالب بنجاح', 'إغلاق', { duration: 3000 });
              this.loadStudents();
            }
          });
      }
    });
  }

  editStudent(student: Student): void {
    const dialogRef = this.dialog.open(StudentPaymentDialogComponent, {
      width: '900px',
      data: {
        student: student,
        availableClasses: this.availableClasses,
        mode: 'edit'
      } as StudentPaymentDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const studentData: CreateStudentRequest = {
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          phoneNumber: result.phoneNumber,
          dateOfBirth: result.dateOfBirth,
          gender: result.gender,
          address: result.address,
          studentNumber: result.studentNumber,
          enrollmentDate: result.enrollmentDate,
          classId: result.classId,
          guardianName: result.guardianName,
          guardianPhone: result.guardianPhone,
          guardianEmail: result.guardianEmail
        };
        
        this.studentService.updateStudent(student.id, studentData)
          .pipe(
            catchError(error => {
              console.error('Error updating student:', error);
              this.snackBar.open('خطأ في تحديث بيانات الطالب', 'إغلاق', { duration: 3000 });
              return of(null);
            })
          )
          .subscribe(response => {
            if (response) {
              this.snackBar.open('تم تحديث بيانات الطالب بنجاح', 'إغلاق', { duration: 3000 });
              this.loadStudents();
            }
          });
      }
    });
  }

  deleteStudent(student: Student): void {
    if (confirm(`هل أنت متأكد من حذف الطالب ${student.user.fullName}؟`)) {
      this.studentService.deleteStudent(student.id)
        .pipe(
          catchError(error => {
            console.error('Error deleting student:', error);
            this.snackBar.open('خطأ في حذف الطالب', 'إغلاق', { duration: 3000 });
            return of(void 0);
          })
        )
        .subscribe(() => {
          this.snackBar.open('تم حذف الطالب بنجاح', 'إغلاق', { duration: 3000 });
          this.loadStudents();
        });
    }
  }

  viewStudent(student: Student): void {
    const dialogRef = this.dialog.open(StudentPaymentDialogComponent, {
      width: '900px',
      data: {
        student: student,
        availableClasses: this.availableClasses,
        mode: 'view'
      } as StudentPaymentDialogData
    });
  }

  getGenderText(gender: number): string {
    switch (gender) {
      case 1: return 'ذكر';
      case 2: return 'أنثى';
      default: return 'غير محدد';
    }
  }
}