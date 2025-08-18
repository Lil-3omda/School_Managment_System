import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../../../shared/components/layout/layout.component';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';
import { ExamService } from '../../../../core/services/exam.service';
import { StudentService } from '../../../../core/services/student.service';
import { GradeService } from '../../../../core/services/grade.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

interface Exam {
  id: number;
  subject: string;
  title: string;
  type: 'midterm' | 'final' | 'quiz' | 'assignment';
  date: Date;
  duration: number; // in minutes
  totalMarks: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  location: string;
  teacher: string;
  description?: string;
  instructions?: string[];
  result?: {
    score: number;
    grade: string;
    percentage: number;
  };
}

@Component({
  selector: 'app-student-exams',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LayoutComponent
  ],
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.scss']
})
export class StudentExamsComponent implements OnInit {
  currentUser: User | null = null;
  exams: Exam[] = [];
  loading = false;
  selectedStatus = 'all';
  selectedSubject = 'all';
  selectedType = 'all';

  constructor(
    private authService: AuthService,
    private examService: ExamService,
    private studentService: StudentService,
    private gradeService: GradeService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadExams();
      }
    });
  }

  loadExams(): void {
    this.loading = true;
    
    if (!this.currentUser) {
      this.loading = false;
      return;
    }

    this.studentService.getStudent(this.currentUser.id)
      .pipe(
        catchError(error => {
          console.error('Error loading student:', error);
          return of(null);
        })
      )
      .subscribe(student => {
        if (student) {
          // Load upcoming exams
          this.examService.getUpcomingExamsForStudent(student.id)
            .pipe(
              catchError(error => {
                console.error('Error loading upcoming exams:', error);
                return of([]);
              })
            )
            .subscribe(upcomingExams => {
              // Load grades for completed exams
              this.gradeService.getGradesByStudent(student.id, 1, 100)
                .pipe(
                  catchError(error => {
                    console.error('Error loading grades:', error);
                    return of({ data: [], totalCount: 0, pageNumber: 1, pageSize: 100, totalPages: 0, hasPreviousPage: false, hasNextPage: false });
                  }),
                  finalize(() => this.loading = false)
                )
                .subscribe(gradesResult => {
                  // Combine upcoming exams and completed exams with grades
                  const upcomingExamsList: Exam[] = upcomingExams.map(exam => ({
                    id: exam.id,
                    subject: exam.subjectName,
                    title: exam.name,
                    date: new Date(exam.examDate),
                    duration: this.parseDuration(exam.duration),
                    totalMarks: exam.totalMarks,
                    type: this.mapExamType(exam.examType), 
                    status: 'upcoming' as const,
                    location: 'قاعة الامتحانات',
                    teacher: 'المعلم',
                    description: exam.description
                  }));

                  const completedExamsList: Exam[] = gradesResult.data.map(grade => ({
                    id: grade.examId,
                    subject: grade.subjectName,
                    title: grade.examName,
                    date: new Date(grade.examDate),
                    duration: 0,
                    totalMarks: grade.totalMarks,
                    type: this.mapExamType(grade.examType), 
                    status: 'completed' as const,
                    location: 'قاعة الامتحانات',
                    teacher: 'المعلم',
                    description: grade.examName,
                    result: {
                      score: grade.marksObtained,
                      grade: grade.gradeValue,
                      percentage: Math.round((grade.marksObtained / grade.totalMarks) * 100)
                    }
                  }));

                  this.exams = [...upcomingExamsList, ...completedExamsList];
                });
            });
        } else {
          this.loading = false;
        }
      });
  }

  private mapExamType(type: number): 'midterm' | 'final' | 'quiz' | 'assignment' {
    switch (type) {
      case 1: return 'quiz';
      case 2: return 'midterm';
      case 3: return 'final';
      case 4: return 'assignment';
      default: return 'quiz';
    }
  }

  private parseDuration(duration: string): number {
    // Parse TimeSpan format "HH:mm:ss" to minutes
    const parts = duration.split(':');
    const hours = parseInt(parts[0]) || 0;
    const minutes = parseInt(parts[1]) || 0;
    return hours * 60 + minutes;
  }

  getFilteredExams(): Exam[] {
    return this.exams.filter(exam => {
      const statusMatch = this.selectedStatus === 'all' || exam.status === this.selectedStatus;
      const subjectMatch = this.selectedSubject === 'all' || exam.subject === this.selectedSubject;
      const typeMatch = this.selectedType === 'all' || exam.type === this.selectedType;
      
      return statusMatch && subjectMatch && typeMatch;
    });
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'upcoming': return 'قادم';
      case 'ongoing': return 'جاري';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      default: return 'غير محدد';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'upcoming': return 'badge bg-primary';
      case 'ongoing': return 'badge bg-warning';
      case 'completed': return 'badge bg-success';
      case 'cancelled': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  getTypeText(type: string): string {
    switch (type) {
      case 'midterm': return 'امتحان نصفي';
      case 'final': return 'امتحان نهائي';
      case 'quiz': return 'اختبار قصير';
      case 'assignment': return 'واجب';
      default: return 'غير محدد';
    }
  }

  getDaysUntilExam(examDate: Date): number {
    const today = new Date();
    const exam = new Date(examDate);
    const diffTime = exam.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getExamStats() {
    const total = this.exams.length;
    const upcoming = this.exams.filter(e => e.status === 'upcoming').length;
    const completed = this.exams.filter(e => e.status === 'completed').length;
    const completedWithResults = this.exams.filter(e => e.status === 'completed' && e.result).length;
    
    let averageScore = 0;
    if (completedWithResults > 0) {
      const totalScore = this.exams
        .filter(e => e.status === 'completed' && e.result)
        .reduce((sum, e) => sum + (e.result?.percentage || 0), 0);
      averageScore = Math.round(totalScore / completedWithResults);
    }

    return {
      total,
      upcoming,
      completed,
      averageScore
    };
  }

  getUniqueSubjects(): string[] {
    return [...new Set(this.exams.map(exam => exam.subject))];
  }

  getUniqueTypes(): string[] {
    return [...new Set(this.exams.map(exam => exam.type))];
  }
}