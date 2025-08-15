import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';

interface Teacher {
  id: number;
  teacherNumber: string;
  user: {
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  subject: string;
  hireDate: Date;
  salary: number;
  isActive: boolean;
}

@Component({
  selector: 'app-manage-teachers',
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
    NavbarComponent
  ],
  templateUrl: './manage-teachers.component.html',
  styleUrls: ['./manage-teachers.component.scss']
})
export class ManageTeachersComponent implements OnInit {
  displayedColumns: string[] = ['teacherNumber', 'name', 'email', 'subject', 'hireDate', 'salary', 'actions'];
  dataSource = new MatTableDataSource<Teacher>();
  loading = false;
  searchTerm = '';

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.loading = true;
    // Mock data for now
    const mockTeachers: Teacher[] = [
      {
        id: 1,
        teacherNumber: 'T001',
        user: {
          fullName: 'أحمد محمد علي',
          email: 'teacher1@school.com',
          phoneNumber: '0501234567'
        },
        subject: 'الرياضيات',
        hireDate: new Date('2020-09-01'),
        salary: 5000,
        isActive: true
      },
      {
        id: 2,
        teacherNumber: 'T002',
        user: {
          fullName: 'فاطمة أحمد السالم',
          email: 'teacher2@school.com',
          phoneNumber: '0507654321'
        },
        subject: 'اللغة العربية',
        hireDate: new Date('2019-09-01'),
        salary: 5200,
        isActive: true
      }
    ];

    setTimeout(() => {
      this.dataSource.data = mockTeachers;
      this.loading = false;
    }, 1000);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addTeacher(): void {
    // TODO: Implement add teacher functionality
    console.log('Add teacher clicked');
  }

  viewTeacher(teacher: Teacher): void {
    // TODO: Implement view teacher functionality
    console.log('View teacher:', teacher);
  }

  editTeacher(teacher: Teacher): void {
    // TODO: Implement edit teacher functionality
    console.log('Edit teacher:', teacher);
  }

  deleteTeacher(teacher: Teacher): void {
    // TODO: Implement delete teacher functionality
    console.log('Delete teacher:', teacher);
  }
}