import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DashboardService, DashboardStatistics, RecentActivity, Notification } from '../../../core/services/dashboard.service';
import { catchError, finalize } from 'rxjs/operators';
import { of, interval, forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports:[
    DatePipe,
    CommonModule,
    RouterModule,
    MatTooltipModule,
    NavbarComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  statistics: DashboardStatistics = {
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    upcomingExams: 0
  };

  recentActivities: RecentActivity[] = [];
  notifications: Notification[] = [];
  loading = false;
  lastUpdated: Date = new Date();

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.setupAutoRefresh();
  }

  private loadDashboardData(): void {
    this.loading = true;
    
    // Load all dashboard data simultaneously
    forkJoin({
      statistics: this.dashboardService.getStatistics(),
      activities: this.dashboardService.getRecentActivities(),
      notifications: this.dashboardService.getNotifications()
    })
      .pipe(
        catchError(error => {
          console.error('Error loading dashboard data:', error);
          return of({
            statistics: {
              totalStudents: 0,
              totalTeachers: 0,
              totalClasses: 0,
              upcomingExams: 0
            },
            activities: [],
            notifications: []
          });
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(result => {
        this.statistics = result.statistics;
        this.recentActivities = result.activities;
        this.notifications = result.notifications;
        this.lastUpdated = new Date();
      });
  }

  private setupAutoRefresh(): void {
    // Refresh dashboard data every 5 minutes
    interval(300000) // 5 minutes in milliseconds
      .subscribe(() => {
        this.loadDashboardData();
      });
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

  markNotificationAsRead(notification: Notification): void {
    this.dashboardService.markNotificationAsRead(notification.id)
      .pipe(
        catchError(error => {
          console.error('Error marking notification as read:', error);
          return of(void 0);
        })
      )
      .subscribe(() => {
        notification.isRead = true;
      });
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }

  getNotificationTypeClass(type: string): string {
    switch (type) {
      case 'warning': return 'warning';
      case 'info': return 'info';
      case 'success': return 'success';
      case 'error': return 'danger';
      default: return 'secondary';
    }
  }

  getNotificationTypeText(type: string): string {
    switch (type) {
      case 'warning': return 'تحذير';
      case 'info': return 'معلومات';
      case 'success': return 'نجح';
      case 'error': return 'خطأ';
      default: return 'عام';
    }
  }
}