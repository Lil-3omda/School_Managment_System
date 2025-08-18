import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface DashboardStatistics {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  upcomingExams: number;
}

export interface RecentActivity {
  id: number;
  description: string;
  userName: string;
  date: Date;
  status: string;
  type: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  date: Date;
  type: string;
  isRead: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly API_URL = `${environment.apiUrl}/dashboard`;
  private statisticsSubject = new BehaviorSubject<DashboardStatistics>({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    upcomingExams: 0
  });
  
  public statistics$ = this.statisticsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getStatistics(): Observable<DashboardStatistics> {
    return this.http.get<DashboardStatistics>(`${this.API_URL}/statistics`)
      .pipe(
        tap(stats => this.statisticsSubject.next(stats))
      );
  }

  getRecentActivities(): Observable<RecentActivity[]> {
    return this.http.get<RecentActivity[]>(`${this.API_URL}/activities`);
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.API_URL}/notifications`);
  }

  markNotificationAsRead(id: number): Observable<void> {
    return this.http.patch<void>(`${this.API_URL}/notifications/${id}/read`, {});
  }

  // Get cached statistics without making API call
  getCachedStatistics(): DashboardStatistics {
    return this.statisticsSubject.value;
  }

  // Refresh all dashboard data
  refreshDashboard(): Observable<{
    statistics: DashboardStatistics;
    activities: RecentActivity[];
    notifications: Notification[];
  }> {
    return this.http.get<{
      statistics: DashboardStatistics;
      activities: RecentActivity[];
      notifications: Notification[];
    }>(`${this.API_URL}/refresh`);
  }
}