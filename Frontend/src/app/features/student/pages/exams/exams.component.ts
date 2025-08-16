import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../../../shared/components/layout/layout.component';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';

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

  constructor(private authService: AuthService) {}

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
    // Mock data - replace with actual API call
    setTimeout(() => {
      this.exams = [
        {
          id: 1,
          subject: 'الرياضيات',
          title: 'امتحان الجبر والهندسة',
          type: 'midterm',
          date: new Date('2024-02-15T09:00:00'),
          duration: 120,
          totalMarks: 100,
          status: 'upcoming',
          location: 'قاعة A101',
          teacher: 'أ. أحمد محمد',
          description: 'امتحان نصف الفصل يشمل الوحدات 1-4',
          instructions: [
            'إحضار آلة حاسبة علمية',
            'الوصول قبل 15 دقيقة من بداية الامتحان',
            'عدم استخدام الهاتف المحمول'
          ]
        },
        {
          id: 2,
          subject: 'اللغة العربية',
          title: 'اختبار الأدب والنثر',
          type: 'quiz',
          date: new Date('2024-01-20T10:30:00'),
          duration: 60,
          totalMarks: 50,
          status: 'completed',
          location: 'قاعة B205',
          teacher: 'أ. فاطمة علي',
          result: {
            score: 42,
            grade: 'A',
            percentage: 84
          }
        },
        {
          id: 3,
          subject: 'العلوم',
          title: 'امتحان الكيمياء النهائي',
          type: 'final',
          date: new Date('2024-03-01T08:00:00'),
          duration: 180,
          totalMarks: 150,
          status: 'upcoming',
          location: 'المختبر العلمي',
          teacher: 'أ. محمد حسن',
          description: 'امتحان نهاية الفصل شامل لجميع الوحدات',
          instructions: [
            'إحضار معطف المختبر',
            'الوصول قبل 30 دقيقة',
            'مراجعة قوانين السلامة'
          ]
        },
        {
          id: 4,
          subject: 'التاريخ',
          title: 'واجب بحثي - الحضارة الإسلامية',
          type: 'assignment',
          date: new Date('2024-01-30T23:59:00'),
          duration: 0,
          totalMarks: 25,
          status: 'upcoming',
          location: 'تسليم إلكتروني',
          teacher: 'أ. سارة أحمد',
          description: 'بحث عن إنجازات الحضارة الإسلامية في العصر العباسي'
        }
      ];
      this.loading = false;
    }, 1000);
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