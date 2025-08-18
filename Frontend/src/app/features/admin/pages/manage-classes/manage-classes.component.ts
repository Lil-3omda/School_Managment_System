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
import { ClassDialogComponent, ClassDialogData } from '../../../../shared/components/dialogs/class-dialog/class-dialog.component';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    NavbarComponent,
    MatSnackBarModule
  ],
  templateUrl: './manage-classes.component.html',
  styleUrls: ['./manage-classes.component.scss']
})
export class ManageClassesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'room', 'capacity', 'schedule', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<Class>();
  loading = false;
  searchTerm = '';
  totalCount = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private classService: ClassService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadClasses();
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
    this.dataSource.filterPredicate = (data: Class, filter: string) => {
      const searchTerm = filter.toLowerCase();
      return data.name.toLowerCase().includes(searchTerm) ||
             data.description.toLowerCase().includes(searchTerm) ||
             data.room.toLowerCase().includes(searchTerm);
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addClass(): void {
    const dialogRef = this.dialog.open(ClassDialogComponent, {
      width: '700px',
      data: {
        mode: 'add'
      } as ClassDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.classService.createClass(result)
          .pipe(
            catchError(error => {
              console.error('Error creating class:', error);
              alert('حدث خطأ في إضافة الصف');
              return of(null);
            })
          )
          .subscribe(response => {
            if (response) {
              this.snackBar.open('تم إضافة الصف بنجاح', 'إغلاق', { duration: 3000 });
              this.loadClasses();
            }
          });
      }
    });
  }

  viewClass(classData: Class): void {
    const dialogRef = this.dialog.open(ClassDialogComponent, {
      width: '700px',
      data: {
        class: classData,
        mode: 'view'
      } as ClassDialogData
    });
  }

  editClass(classData: Class): void {
    const dialogRef = this.dialog.open(ClassDialogComponent, {
      width: '700px',
      data: {
        class: classData,
        mode: 'edit'
      } as ClassDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.classService.updateClass(classData.id, result)
          .pipe(
            catchError(error => {
              console.error('Error updating class:', error);
              return of(null);
            })
          )
          .subscribe(response => {
            if (response) {
              this.snackBar.open('تم تحديث الصف بنجاح', 'إغلاق', { duration: 3000 });
              this.loadClasses();
            }
          });
      }
    });
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
          this.snackBar.open('تم حذف الصف بنجاح', 'إغلاق', { duration: 3000 });
          this.loadClasses();
        });
    }
  }

  getCapacityClass(current: number, total: number): string {
    const percentage = (current / total) * 100;
    if (percentage >= 90) return 'capacity-warn';
    if (percentage >= 70) return 'capacity-accent';
    return 'capacity-primary';
  }
}