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
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { ClassService, Class } from '../../../../core/services/class.service';
import { TeacherService, Teacher } from '../../../../core/services/teacher.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-manage-classes',
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
    MatDialogModule,
    MatTooltipModule,
    ReactiveFormsModule,
    NavbarComponent
  ],
  templateUrl: './manage-classes.component.html',
  styleUrls: ['./manage-classes.component.scss']
})
export class ManageClassesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'grade', 'capacity', 'teacherName', 'academicYear', 'isActive', 'actions'];
  dataSource = new MatTableDataSource<Class>();
  loading = false;
  searchTerm = '';
  totalCount = 0;
  teachers: Teacher[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private classService: ClassService,
    private teacherService: TeacherService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadClasses();
    this.loadTeachers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadClasses(): void {
    this.loading = true;
    
    this.classService.getClasses(1, 10)
      .pipe(
        catchError(error => {
          console.error('Error loading classes:', error);
          return of({ items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 });
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(result => {
        this.dataSource.data = result.items;
        this.totalCount = result.totalCount;
      });
  }

  loadTeachers(): void {
    this.teacherService.getTeachers(1, 100)
      .pipe(
        catchError(error => {
          console.error('Error loading teachers:', error);
          return of({ items: [], totalCount: 0, pageNumber: 1, pageSize: 100, totalPages: 0 });
        })
      )
      .subscribe(result => {
        this.teachers = result.items;
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addClass(): void {
    // TODO: Implement add class dialog
    console.log('Add class clicked');
  }

  viewClass(classData: Class): void {
    // TODO: Implement view class dialog
    console.log('View class:', classData);
  }

  editClass(classData: Class): void {
    // TODO: Implement edit class dialog
    console.log('Edit class:', classData);
  }

  deleteClass(classData: Class): void {
    if (confirm(`هل أنت متأكد من حذف الصف ${classData.name}؟`)) {
      this.classService.deleteClass(classData.id)
        .pipe(
          catchError(error => {
            console.error('Error deleting class:', error);
            return of(void 0);
          })
        )
        .subscribe(() => {
          this.loadClasses();
        });
    }
  }

  getGradeText(grade: number): string {
    const grades = ['', 'الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس'];
    return grades[grade] || grade.toString();
  }
}