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
  showAddDialog = false;
  
  studentForm: FormGroup;
  availableClasses: Class[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private studentService: StudentService,
    private classService: ClassService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      studentNumber: ['', Validators.required],
      classId: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      guardianName: ['', Validators.required],
      guardianPhone: ['', Validators.required],
      guardianEmail: ['', [Validators.required, Validators.email]],
      enrollmentDate: [new Date(), Validators.required]
    });
  }

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
          return of({ data: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0, hasPreviousPage: false, hasNextPage: false });
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
          return of({ items: [], totalCount: 0, pageNumber: 1, pageSize: 100, totalPages: 0 });
        })
      )
      .subscribe(result => {
        this.availableClasses = result.items;
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addStudent(): void {
    this.showAddDialog = true;
    this.studentForm.reset();
    this.studentForm.patchValue({
      enrollmentDate: new Date()
    });
  }

  closeAddDialog(): void {
    this.showAddDialog = false;
    this.studentForm.reset();
  }

  onSubmitStudent(): void {
    if (this.studentForm.valid) {
      this.submitting = true;
      
      const studentData: CreateStudentRequest = {
        ...this.studentForm.value,
        gender: parseInt(this.studentForm.value.gender)
      };
      
      this.studentService.createStudent(studentData)
        .pipe(
          catchError(error => {
            console.error('Error creating student:', error);
            this.snackBar.open('خطأ في إضافة الطالب', 'إغلاق', { duration: 3000 });
            return of(null);
          }),
          finalize(() => this.submitting = false)
        )
        .subscribe(response => {
          if (response) {
            this.snackBar.open('تم إضافة الطالب بنجاح', 'إغلاق', { duration: 3000 });
            this.closeAddDialog();
            this.loadStudents();
          }
        });
    }
  }

  editStudent(student: Student): void {
    console.log('Edit student:', student);
    // TODO: Implement edit dialog
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
    console.log('View student:', student);
    // TODO: Implement view dialog
  }

  getGenderText(gender: number): string {
    switch (gender) {
      case 1: return 'ذكر';
      case 2: return 'أنثى';
      default: return 'غير محدد';
    }
  }
}