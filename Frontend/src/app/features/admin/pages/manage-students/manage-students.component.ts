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
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../../../../core/services/student.service';
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
    ReactiveFormsModule
  ],
  templateUrl: './manage-students.component.html',
  styleUrls: ['./manage-students.component.scss']
})
export class ManageStudentsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['studentNumber', 'name', 'email', 'class', 'enrollmentDate', 'actions'];
  dataSource = new MatTableDataSource<Student>();
  loading = false;
  totalCount = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private studentService: StudentService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadStudents();
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
          return of({ items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 });
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(result => {
        this.dataSource.data = result.items;
        this.totalCount = result.totalCount;
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addStudent(): void {
    // Open dialog for adding student
    console.log('Add student dialog');
  }

  editStudent(student: Student): void {
    // Open dialog for editing student
    console.log('Edit student:', student);
  }

  deleteStudent(student: Student): void {
    if (confirm(`هل أنت متأكد من حذف الطالب ${student.user.fullName}؟`)) {
      // Delete student
      console.log('Delete student:', student);
    }
  }

  viewStudent(student: Student): void {
    // Navigate to student details
    console.log('View student:', student);
  }

  getGenderText(gender: number): string {
    switch (gender) {
      case 1: return 'ذكر';
      case 2: return 'أنثى';
      default: return 'غير محدد';
    }
  }
}