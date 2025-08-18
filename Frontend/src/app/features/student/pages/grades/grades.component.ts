import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../../../shared/components/layout/layout.component';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';
import { GradeService } from '../../../../core/services/grade.service';
import { StudentService } from '../../../../core/services/student.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

interface Grade {
  id: number;
  subject: string;
  examType: string;
  score: number;
  totalScore: number;
  percentage: number;
  grade: string;
  date: Date;
  semester: string;
  isPassed: boolean;
}

@Component({
  selector: 'app-student-grades',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LayoutComponent
  ],
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.scss']
})
export class StudentGradesComponent implements OnInit {
  currentUser: User | null = null;
  grades: Grade[] = [];
  loading = false;
  selectedSemester = 'all';
  selectedSubject = 'all';

  // Summary stats properties
  passedGradesCount = 0;
  totalExamsCount = 0;
  highestPercentage = 0;
  gpa = 0;

  constructor(
    private authService: AuthService,
    private gradeService: GradeService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadGrades();
      }
    });
  }

  loadGrades(): void {
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
          this.gradeService.getGradesByStudent(student.id, 1, 100)
            .pipe(
              catchError(error => {
                console.error('Error loading grades:', error);
                return of({ data: [], totalCount: 0, pageNumber: 1, pageSize: 100, totalPages: 0, hasPreviousPage: false, hasNextPage: false });
              }),
              finalize(() => this.loading = false)
            )
            .subscribe(result => {
              this.grades = result.data.map(grade => ({
                id: grade.id,
                subject: grade.subjectName,
                examType: grade.examName,
                score: grade.marksObtained,
                totalScore: grade.totalMarks,
                percentage: Math.round((grade.marksObtained / grade.totalMarks) * 100),
                grade: grade.gradeValue,
                date: new Date(grade.examDate),
                semester: 'الفصل الأول', // TODO: Add semester to API
                isPassed: grade.isPassed
              }));
              this.calculateSummaryStats();
            });
        } else {
          this.loading = false;
        }
      });
  }

  getFilteredGrades(): Grade[] {
    const filtered = this.grades.filter(grade => {
      const semesterMatch = this.selectedSemester === 'all' || grade.semester === this.selectedSemester;
      const subjectMatch = this.selectedSubject === 'all' || grade.subject === this.selectedSubject;
      return semesterMatch && subjectMatch;
    });
    this.calculateSummaryStats();
    return filtered;
  }

  calculateSummaryStats(): void {
    const filteredGrades = this.grades.filter(grade => {
      const semesterMatch = this.selectedSemester === 'all' || grade.semester === this.selectedSemester;
      const subjectMatch = this.selectedSubject === 'all' || grade.subject === this.selectedSubject;
      return semesterMatch && subjectMatch;
    });
    
    this.passedGradesCount = filteredGrades.filter(g => g.isPassed).length;
    this.totalExamsCount = filteredGrades.length;
    this.highestPercentage = filteredGrades.length > 0 ? 
      Math.max(...filteredGrades.map(g => g.percentage)) : 0;
    this.gpa = this.calculateGPA();
  }

  calculateGPA(): number {
    const filteredGrades = this.grades.filter(grade => {
      const semesterMatch = this.selectedSemester === 'all' || grade.semester === this.selectedSemester;
      const subjectMatch = this.selectedSubject === 'all' || grade.subject === this.selectedSubject;
      return semesterMatch && subjectMatch;
    });
    
    if (filteredGrades.length === 0) return 0;
    const totalPercentage = filteredGrades.reduce((sum, grade) => sum + grade.percentage, 0);
    return Number((totalPercentage / filteredGrades.length).toFixed(2));
  }

  getGradeClass(grade: string): string {
    switch (grade) {
      case 'A+': return 'badge bg-success';
      case 'A': return 'badge bg-success';
      case 'B+': return 'badge bg-info';
      case 'B': return 'badge bg-info';
      case 'C+': return 'badge bg-warning';
      case 'C': return 'badge bg-warning';
      case 'D': return 'badge bg-danger';
      case 'F': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  getUniqueSubjects(): string[] {
    return [...new Set(this.grades.map(grade => grade.subject))];
  }

  getUniqueSemesters(): string[] {
    return [...new Set(this.grades.map(grade => grade.semester))];
  }
}