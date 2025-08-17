import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  constructor(private http: HttpClient) {}

  getStatistics(): Observable<DashboardStatistics> {
    return this.http.get<DashboardStatistics>(`${this.API_URL}/statistics`).pipe(
      catchError(error => {
        console.error('Dashboard API error:', error);
        // Return mock data as fallback
        return of({
          totalStudents: 1250,
          totalTeachers: 85,
          totalClasses: 45,
          upcomingExams: 12
        });
      })
    );
  }

  getRecentActivities(): Observable<RecentActivity[]> {
    return this.http.get<RecentActivity[]>(`${this.API_URL}/activities`).pipe(
      catchError(error => {
        console.error('Activities API error:', error);
        return of([]);
      })
    );
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.API_URL}/notifications`).pipe(
      catchError(error => {
        console.error('Notifications API error:', error);
        return of([]);
      })
    );
  }

  markNotificationAsRead(id: number): Observable<void> {
    return this.http.patch<void>(`${this.API_URL}/notifications/${id}/read`, {});
  }
}

import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
}