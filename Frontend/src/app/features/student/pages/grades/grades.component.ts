import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../../../shared/components/layout/layout.component';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';

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

  constructor(private authService: AuthService) {}

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
    // Mock data - replace with actual API call
    setTimeout(() => {
      this.grades = [
        {
          id: 1,
          subject: 'الرياضيات',
          examType: 'امتحان نصفي',
          score: 85,
          totalScore: 100,
          percentage: 85,
          grade: 'A',
          date: new Date('2024-01-15'),
          semester: 'الفصل الأول',
          isPassed: true
        },
        {
          id: 2,
          subject: 'اللغة العربية',
          examType: 'امتحان نهائي',
          score: 92,
          totalScore: 100,
          percentage: 92,
          grade: 'A+',
          date: new Date('2024-01-20'),
          semester: 'الفصل الأول',
          isPassed: true
        },
        {
          id: 3,
          subject: 'العلوم',
          examType: 'اختبار قصير',
          score: 78,
          totalScore: 100,
          percentage: 78,
          grade: 'B+',
          date: new Date('2024-01-10'),
          semester: 'الفصل الأول',
          isPassed: true
        },
        {
          id: 4,
          subject: 'التاريخ',
          examType: 'امتحان نصفي',
          score: 65,
          totalScore: 100,
          percentage: 65,
          grade: 'C+',
          date: new Date('2024-01-12'),
          semester: 'الفصل الأول',
          isPassed: true
        }
      ];
      this.loading = false;
    }, 1000);
  }

  getFilteredGrades(): Grade[] {
    return this.grades.filter(grade => {
      const semesterMatch = this.selectedSemester === 'all' || grade.semester === this.selectedSemester;
      const subjectMatch = this.selectedSubject === 'all' || grade.subject === this.selectedSubject;
      return semesterMatch && subjectMatch;
    });
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

  calculateGPA(): number {
    const filteredGrades = this.getFilteredGrades();
    if (filteredGrades.length === 0) return 0;
    
    const totalPercentage = filteredGrades.reduce((sum, grade) => sum + grade.percentage, 0);
    return Number((totalPercentage / filteredGrades.length).toFixed(2));
  }

  getUniqueSubjects(): string[] {
    return [...new Set(this.grades.map(grade => grade.subject))];
  }

  getUniqueSemesters(): string[] {
    return [...new Set(this.grades.map(grade => grade.semester))];
  }
}