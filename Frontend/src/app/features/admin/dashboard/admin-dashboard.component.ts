import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DashboardService, DashboardStatistics, RecentActivity, Notification } from '../../../core/services/dashboard.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

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

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadStatistics();
    this.loadRecentActivities();
    this.loadNotifications();
  }

    private loadStatistics(): void {
    this.loading = true;
    this.dashboardService.getStatistics()
      .pipe(
        catchError(error => {
          console.error('Error loading statistics:', error);
          return of(this.statistics);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(data => {
        this.statistics = data;
      });
  }

  private loadRecentActivities(): void {
    this.dashboardService.getRecentActivities()
      .pipe(
        catchError(error => {
          console.error('Error loading activities:', error);
          return of([]);
        })
      )
      .subscribe(data => {
        this.recentActivities = data;
      });
  }

  private loadNotifications(): void {
    this.dashboardService.getNotifications()
      .pipe(
        catchError(error => {
          console.error('Error loading notifications:', error);
          return of([]);
        })
      )
      .subscribe(data => {
        this.notifications = data;
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
}