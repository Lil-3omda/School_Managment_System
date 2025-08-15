import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

interface Statistics {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  upcomingExams: number;
}

interface Activity {
  description: string;
  userName: string;
  date: Date;
  status: string;
}

interface Notification {
  title: string;
  message: string;
  date: Date;
  type: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports:[
    DatePipe,
    CommonModule,
    RouterModule,
    NavbarComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  statistics: Statistics = {
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    upcomingExams: 0
  };

  recentActivities: Activity[] = [];
  notifications: Notification[] = [];

  constructor() {}

  ngOnInit(): void {
    this.loadStatistics();
    this.loadRecentActivities();
    this.loadNotifications();
  }

  private loadStatistics(): void {
    // Mock data - replace with actual API calls
    this.statistics = {
      totalStudents: 1250,
      totalTeachers: 85,
      totalClasses: 45,
      upcomingExams: 12
    };
  }

  private loadRecentActivities(): void {
    // Mock data - replace with actual API calls
    this.recentActivities = [
      {
        description: 'تم إضافة طالب جديد',
        userName: 'أحمد محمد',
        date: new Date(),
        status: 'مكتمل'
      },
      {
        description: 'تم تحديث درجات الامتحان',
        userName: 'فاطمة علي',
        date: new Date(Date.now() - 86400000),
        status: 'مكتمل'
      },
      {
        description: 'تم إنشاء صف جديد',
        userName: 'محمد حسن',
        date: new Date(Date.now() - 172800000),
        status: 'قيد المراجعة'
      }
    ];
  }

  private loadNotifications(): void {
    // Mock data - replace with actual API calls
    this.notifications = [
      {
        title: 'امتحان الرياضيات',
        message: 'امتحان الرياضيات للصف الثالث غداً',
        date: new Date(),
        type: 'warning'
      },
      {
        title: 'اجتماع المعلمين',
        message: 'اجتماع دوري للمعلمين يوم الأحد',
        date: new Date(Date.now() - 86400000),
        type: 'info'
      },
      {
        title: 'تحديث النظام',
        message: 'سيتم تحديث النظام ليلة السبت',
        date: new Date(Date.now() - 172800000),
        type: 'success'
      }
    ];
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'مكتمل':
        return 'bg-success';
      case 'قيد المراجعة':
        return 'bg-warning';
      case 'ملغي':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}