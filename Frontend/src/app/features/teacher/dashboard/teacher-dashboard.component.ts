import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

interface TeacherStats {
  totalClasses: number;
  totalStudents: number;
  monthlyExams: number;
  averageAttendance: number;
}

interface ClassSchedule {
  time: string;
  subject: string;
  className: string;
  room: string;
}

interface PendingTask {
  title: string;
  description: string;
  dueDate: Date;
  priority: string;
}

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports:[
    DatePipe,
    CommonModule,
    RouterModule,
    NavbarComponent
  ],
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss']
})
export class TeacherDashboardComponent implements OnInit {
  currentUser: User | null = null;
  teacherStats: TeacherStats = {
    totalClasses: 0,
    totalStudents: 0,
    monthlyExams: 0,
    averageAttendance: 0
  };

  todaySchedule: ClassSchedule[] = [];
  pendingTasks: PendingTask[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    this.loadTeacherStats();
    this.loadTodaySchedule();
    this.loadPendingTasks();
  }

  private loadTeacherStats(): void {
    // Mock data - replace with actual API calls
    this.teacherStats = {
      totalClasses: 5,
      totalStudents: 125,
      monthlyExams: 8,
      averageAttendance: 88
    };
  }

  private loadTodaySchedule(): void {
    // Mock data - replace with actual API calls
    this.todaySchedule = [
      {
        time: '08:00 - 09:00',
        subject: 'الرياضيات',
        className: 'الصف الثالث أ',
        room: 'قاعة 101'
      },
      {
        time: '09:15 - 10:15',
        subject: 'الفيزياء',
        className: 'الصف الثاني ب',
        room: 'مختبر الفيزياء'
      },
      {
        time: '10:30 - 11:30',
        subject: 'الرياضيات',
        className: 'الصف الأول أ',
        room: 'قاعة 205'
      },
      {
        time: '12:00 - 13:00',
        subject: 'الفيزياء',
        className: 'الصف الثالث ب',
        room: 'مختبر الفيزياء'
      }
    ];
  }

  private loadPendingTasks(): void {
    // Mock data - replace with actual API calls
    this.pendingTasks = [
      {
        title: 'تصحيح امتحان الرياضيات',
        description: 'امتحان الصف الثالث أ',
        dueDate: new Date(Date.now() + 86400000),
        priority: 'عالي'
      },
      {
        title: 'إعداد امتحان الفيزياء',
        description: 'امتحان نصفي للصف الثاني',
        dueDate: new Date(Date.now() + 259200000),
        priority: 'متوسط'
      },
      {
        title: 'تحديث درجات الواجبات',
        description: 'واجبات الأسبوع الماضي',
        dueDate: new Date(Date.now() + 172800000),
        priority: 'منخفض'
      }
    ];
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'عالي':
        return 'bg-danger';
      case 'متوسط':
        return 'bg-warning';
      case 'منخفض':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }
}