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
import { SubjectService, Subject } from '../../../../core/services/subject.service';
import { SubjectDialogComponent, SubjectDialogData } from '../../../../shared/components/dialogs/subject-dialog/subject-dialog.component';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-manage-subjects',
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
  templateUrl: './manage-subjects.component.html',
  // styleUrls: ['./manage-subjects.component.scss']
})
export class ManageSubjectsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['code', 'name', 'description', 'credits', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<Subject>();
  loading = false;
  searchTerm = '';
  totalCount = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private subjectService: SubjectService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadSubjects(): void {
    this.loading = true;
    
    this.subjectService.getSubjects(1, 10)
      .pipe(
        catchError(error => {
          console.error('Error loading subjects:', error);
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
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addSubject(): void {
    const dialogRef = this.dialog.open(SubjectDialogComponent, {
      width: '600px',
      data: {
        mode: 'add'
      } as SubjectDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.subjectService.createSubject(result)
          .pipe(
            catchError(error => {
              console.error('Error creating subject:', error);
              return of(null);
            })
          )
          .subscribe(response => {
            if (response) {
              alert('تم إضافة المادة بنجاح');
              this.loadSubjects();
            }
          });
      }
    });
  }

  viewSubject(subject: Subject): void {
    const dialogRef = this.dialog.open(SubjectDialogComponent, {
      width: '600px',
      data: {
        subject: subject,
        mode: 'view'
      } as SubjectDialogData
    });
  }

  editSubject(subject: Subject): void {
    const dialogRef = this.dialog.open(SubjectDialogComponent, {
      width: '600px',
      data: {
        subject: subject,
        mode: 'edit'
      } as SubjectDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.subjectService.updateSubject(subject.id, result)
          .pipe(
            catchError(error => {
              console.error('Error updating subject:', error);
              return of(null);
            })
          )
          .subscribe(response => {
            if (response) {
              this.loadSubjects();
            }
          });
      }
    });
  }

  deleteSubject(subject: Subject): void {
    if (confirm(`هل أنت متأكد من حذف المادة ${subject.name}؟`)) {
      this.subjectService.deleteSubject(subject.id)
        .pipe(
          catchError(error => {
            console.error('Error deleting subject:', error);
            return of(void 0);
          })
        )
        .subscribe(() => {
          this.loadSubjects();
        });
    }
  }
}