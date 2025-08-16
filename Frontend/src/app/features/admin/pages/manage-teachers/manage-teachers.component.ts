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
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { TeacherService, Teacher } from '../../../../core/services/teacher.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';



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
    MatTooltipModule,
    NavbarComponent
  ],
  templateUrl: './manage-teachers.component.html',
  styleUrls: ['./manage-teachers.component.scss']
})
export class ManageTeachersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['teacherNumber', 'name', 'email', 'subject', 'hireDate', 'salary', 'actions'];
  dataSource = new MatTableDataSource<Teacher>();
  loading = false;
  searchTerm = '';
  totalCount = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private teacherService: TeacherService) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadTeachers(): void {
    this.loading = true;
    
    this.teacherService.getTeachers(1, 10)
      .pipe(
        catchError(error => {
          console.error('Error loading teachers:', error);
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

  addTeacher(): void {
    // TODO: Implement add teacher dialog
    console.log('Add teacher clicked');
  }

  viewTeacher(teacher: Teacher): void {
    // TODO: Implement view teacher dialog
    console.log('View teacher:', teacher);
  }

  editTeacher(teacher: Teacher): void {
    // TODO: Implement edit teacher dialog
    console.log('Edit teacher:', teacher);
  }

  deleteTeacher(teacher: Teacher): void {
    if (confirm(`هل أنت متأكد من حذف المعلم ${teacher.user.fullName}؟`)) {
      this.teacherService.deleteTeacher(teacher.id)
        .pipe(
          catchError(error => {
            console.error('Error deleting teacher:', error);
            return of(void 0);
          })
        )
        .subscribe(() => {
          this.loadTeachers();
        });
    }
  }
}