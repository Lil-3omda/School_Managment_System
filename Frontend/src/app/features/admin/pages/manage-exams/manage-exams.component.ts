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
import { ExamService, Exam } from '../../../../core/services/exam.service';
import { SubjectService, Subject } from '../../../../core/services/subject.service';
import { ClassService, Class } from '../../../../core/services/class.service';
import { ExamDialogComponent, ExamDialogData } from '../../../../shared/components/dialogs/exam-dialog/exam-dialog.component';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-manage-exams',
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
  templateUrl: './manage-exams.component.html',
  // styleUrls: ['./manage-exams.component.scss']
})
export class ManageExamsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['title', 'subjectName', 'className', 'examDate', 'duration', 'totalMarks', 'isActive', 'actions'];
  dataSource = new MatTableDataSource<Exam>();
  loading = false;
  searchTerm = '';
  totalCount = 0;
  subjects: Subject[] = [];
  classes: Class[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private examService: ExamService,
    private subjectService: SubjectService,
    private classService: ClassService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadExams();
    this.loadSubjects();
    this.loadClasses();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadExams(): void {
    this.loading = true;
    
    this.examService.getExams(1, 10)
      .pipe(
        catchError(error => {
          console.error('Error loading exams:', error);
          return of({ items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 });
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(result => {
        this.dataSource.data = result.items;
        this.totalCount = result.totalCount;
      });
  }

  loadSubjects(): void {
    this.subjectService.getSubjects(1, 100)
      .pipe(
        catchError(error => {
          console.error('Error loading subjects:', error);
          return of({ items: [], totalCount: 0, pageNumber: 1, pageSize: 100, totalPages: 0 });
        })
      )
      .subscribe(result => {
        this.subjects = result.items;
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
        this.classes = result.items;
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data: Exam, filter: string) => {
      const searchTerm = filter.toLowerCase();
      return data.title.toLowerCase().includes(searchTerm) ||
             data.description.toLowerCase().includes(searchTerm) ||
             data.subjectName.toLowerCase().includes(searchTerm) ||
             data.className.toLowerCase().includes(searchTerm);
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addExam(): void {
    const dialogRef = this.dialog.open(ExamDialogComponent, {
      width: '700px',
      data: {
        classes: this.classes,
        subjects: this.subjects,
        mode: 'add'
      } as ExamDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.examService.createExam(result)
          .pipe(
            catchError(error => {
              console.error('Error creating exam:', error);
              return of(null);
            })
          )
          .subscribe(response => {
            if (response) {
              this.snackBar.open('تم إضافة الامتحان بنجاح', 'إغلاق', { duration: 3000 });
              this.loadExams();
            }
          });
      }
    });
  }

  viewExam(exam: Exam): void {
    const dialogRef = this.dialog.open(ExamDialogComponent, {
      width: '700px',
      data: {
        exam: exam,
        classes: this.classes,
        subjects: this.subjects,
        mode: 'view'
      } as ExamDialogData
    });
  }

  editExam(exam: Exam): void {
    const dialogRef = this.dialog.open(ExamDialogComponent, {
      width: '700px',
      data: {
        exam: exam,
        classes: this.classes,
        subjects: this.subjects,
        mode: 'edit'
      } as ExamDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.examService.updateExam(exam.id, result)
          .pipe(
            catchError(error => {
              console.error('Error updating exam:', error);
              return of(null);
            })
          )
          .subscribe(response => {
            if (response) {
              this.snackBar.open('تم تحديث الامتحان بنجاح', 'إغلاق', { duration: 3000 });
              this.loadExams();
            }
          });
      }
    });
  }

  deleteExam(exam: Exam): void {
    if (confirm(`هل أنت متأكد من حذف الامتحان ${exam.title}؟`)) {
      this.examService.deleteExam(exam.id)
        .pipe(
          catchError(error => {
            console.error('Error deleting exam:', error);
            return of(void 0);
          })
        )
        .subscribe(() => {
          this.snackBar.open('تم حذف الامتحان بنجاح', 'إغلاق', { duration: 3000 });
          this.loadExams();
        });
    }
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} ساعة ${mins} دقيقة`;
    }
    return `${mins} دقيقة`;
  }
}