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
import { TeacherDialogComponent, TeacherDialogData } from '../../../../shared/components/dialogs/teacher-dialog/teacher-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';



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
    NavbarComponent,
    MatSnackBarModule
  ],
  templateUrl: './manage-teachers.component.html',
  styleUrls: ['./manage-teachers.component.scss']
})
export class ManageTeachersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['employeeNumber', 'name', 'email', 'specialization', 'hireDate', 'baseSalary', 'actions'];
  dataSource = new MatTableDataSource<Teacher>();
  loading = false;
  searchTerm = '';
  totalCount = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private teacherService: TeacherService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

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
          return of({ data: [], items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0, hasPreviousPage: false, hasNextPage: false });
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(result => {
        this.dataSource.data = result.data || result.items || [];
        this.totalCount = result.totalCount;
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data: Teacher, filter: string) => {
      const searchTerm = filter.toLowerCase();
      return data.user.firstName.toLowerCase().includes(searchTerm) ||
             data.user.lastName.toLowerCase().includes(searchTerm) ||
             data.user.fullName.toLowerCase().includes(searchTerm) ||
             data.user.email.toLowerCase().includes(searchTerm) ||
             data.employeeNumber.toLowerCase().includes(searchTerm) ||
             data.specialization.toLowerCase().includes(searchTerm);
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addTeacher(): void {
    const dialogRef = this.dialog.open(TeacherDialogComponent, {
      width: '800px',
      data: {
        mode: 'add'
      } as TeacherDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.teacherService.createTeacher(result)
          .pipe(
            catchError(error => {
              console.error('Error creating teacher:', error);
              return of(null);
            })
          )
          .subscribe(response => {
            if (response) {
              this.snackBar.open('تم إضافة المعلم بنجاح', 'إغلاق', { duration: 3000 });
              this.loadTeachers();
            }
          });
      }
    });
  }

  viewTeacher(teacher: Teacher): void {
    const dialogRef = this.dialog.open(TeacherDialogComponent, {
      width: '800px',
      data: {
        teacher: teacher,
        mode: 'view'
      } as TeacherDialogData
    });
  }

  editTeacher(teacher: Teacher): void {
    const dialogRef = this.dialog.open(TeacherDialogComponent, {
      width: '800px',
      data: {
        teacher: teacher,
        mode: 'edit'
      } as TeacherDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.teacherService.updateTeacher(teacher.id, result)
          .pipe(
            catchError(error => {
              console.error('Error updating teacher:', error);
              return of(null);
            })
          )
          .subscribe(response => {
            if (response) {
              this.snackBar.open('تم تحديث المعلم بنجاح', 'إغلاق', { duration: 3000 });
              this.loadTeachers();
            }
          });
      }
    });
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
          this.snackBar.open('تم حذف المعلم بنجاح', 'إغلاق', { duration: 3000 });
          this.loadTeachers();
        });
    }
  }
}