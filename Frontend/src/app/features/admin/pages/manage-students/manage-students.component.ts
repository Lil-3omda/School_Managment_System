import { Component, OnInit, ViewChild } from '@angular/core';
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
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../../../../core/services/student.service';
import { Student, CreateStudentRequest } from '../../../../core/models/student.model';

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
    ReactiveFormsModule
  ],
  templateUrl: './manage-students.component.html',
  styleUrls: ['./manage-students.component.scss']
})
export class ManageStudentsComponent implements OnInit {
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
    
    // Mock data for now
    const mockStudents: Student[] = [
      {
        id: 1,
        userId: 3,
        studentNumber: 'S001',
        enrollmentDate: new Date('2023-09-01'),
        classId: 1,
        className: 'الصف الثالث أ',
        guardianName: 'عبد الله الطالب',
        guardianPhone: '0501111111',
        guardianEmail: 'guardian@example.com',
        user: {
          id: 3,
          firstName: 'محمد',
          lastName: 'الطالب',
          email: 'student@school.com',
          phoneNumber: '0509876543',
          dateOfBirth: new Date('2010-03-20'),
          gender: 1,
          address: 'الدمام، المملكة العربية السعودية',
          role: 3,
          isActive: true,
          fullName: 'محمد الطالب',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        userId: 4,
        studentNumber: 'S002',
        enrollmentDate: new Date('2023-09-01'),
        classId: 1,
        className: 'الصف الثالث أ',
        guardianName: 'أحمد سالم',
        guardianPhone: '0502222222',
        guardianEmail: 'ahmed.salem@example.com',
        user: {
          id: 4,
          firstName: 'سارة',
          lastName: 'أحمد',
          email: 'sara.ahmed@school.com',
          phoneNumber: '0508765432',
          dateOfBirth: new Date('2010-05-15'),
          gender: 2,
          address: 'الرياض، المملكة العربية السعودية',
          role: 3,
          isActive: true,
          fullName: 'سارة أحمد',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.dataSource.data = mockStudents;
    this.totalCount = mockStudents.length;
    this.loading = false;
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