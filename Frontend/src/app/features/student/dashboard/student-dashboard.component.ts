import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { CommonModule, DatePipe } from '@angular/common';

interface StudentStats {
  gpa: number;
  attendanceRate: number;
  enrolledSubjects: number;
  upcomingExams: number;
}

interface Grade {
  subject: string;
  examType: string;
  score: number;
  totalScore: number;
  date: Date;
  isPassed: boolean;
}

interface Exam {
  subject: string;
  type: string;
  date: Date;
}

interface ClassSchedule {
  subject: string;
  teacher: string;
  time: string;
  room: string;
}

@Component({
  selector: 'app-student-dashboard',
  imports: [
    DatePipe,
    CommonModule
  ],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {
  currentUser: User | null = null;
  studentStats: StudentStats = {
    gpa: 0,
    attendanceRate: 0,
    enrolledSubjects: 0,
    upcomingExams: 0
  };

  recentGrades: Grade[] = [];
  upcomingExams: Exam[] = [];
  todaySchedule: ClassSchedule[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    this.loadStudentStats();
    this.loadRecentGrades();
    this.loadUpcomingExams();
    this.loadTodaySchedule();
  }

  private loadStudentStats(): void {
    // Mock data - replace with actual API calls
    this.studentStats = {
      gpa: 3.75,
      attendanceRate: 92,
      enrolledSubjects: 6,
      upcomingExams: 3
    };
  }

  private loadRecentGrades(): void {
    // Mock data - replace with actual API calls
    this.recentGrades = [
      {
        subject: 'الرياضيات',
        examType: 'امتحان نصفي',
        score: 85,
        totalScore: 100,
        date: new Date(Date.now() - 86400000),
        isPassed: true
      },
      {
        subject: 'العلوم',
        examType: 'واجب',
        score: 78,
        totalScore: 80,
        date: new Date(Date.now() - 172800000),
        isPassed: true
      },
      {
        subject: 'اللغة العربية',
        examType: 'اختبار قصير',
        score: 45,
        totalScore: 50,
        date: new Date(Date.now() - 259200000),
        isPassed: true
      }
    ];
  }

  private loadUpcomingExams(): void {
    // Mock data - replace with actual API calls
    this.upcomingExams = [
      {
        subject: 'الفيزياء',
        type: 'امتحان نهائي',
        date: new Date(Date.now() + 604800000) // 7 days from now
      },
      {
        subject: 'الكيمياء',
        type: 'امتحان نصفي',
        date: new Date(Date.now() + 1209600000) // 14 days from now
      },
      {
        subject: 'التاريخ',
        type: 'اختبار قصير',
        date: new Date(Date.now() + 259200000) // 3 days from now
      }
    ];
  }

  private loadTodaySchedule(): void {
    // Mock data - replace with actual API calls
    this.todaySchedule = [
      {
        subject: 'الرياضيات',
        teacher: 'أ. محمد أحمد',
        time: '08:00 - 09:00',
        room: 'قاعة 101'
      },
      {
        subject: 'العلوم',
        teacher: 'أ. فاطمة علي',
        time: '09:15 - 10:15',
        room: 'مختبر العلوم'
      },
      {
        subject: 'اللغة العربية',
        teacher: 'أ. عبد الله حسن',
        time: '10:30 - 11:30',
        room: 'قاعة 205'
      }
    ];
  }

  getGradeStatusClass(isPassed: boolean): string {
    return isPassed ? 'bg-success' : 'bg-danger';
  }

  getDaysUntilExam(examDate: Date): number {
    const today = new Date();
    const diffTime = examDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}