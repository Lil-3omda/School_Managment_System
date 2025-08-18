import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LayoutComponent } from '../../../../shared/components/layout/layout.component';
import { AuthService } from '../../../../core/services/auth.service';
import { ScheduleService, Schedule } from '../../../../core/services/schedule.service';
import { User } from '../../../../core/models/user.model';
import { TeacherService } from '../../../../core/services/teacher.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-teacher-schedule',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    LayoutComponent
  ],
  template: `
    <app-layout>
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">الجدول الدراسي</h1>
        <button mat-raised-button color="primary" (click)="loadSchedule()">
          <mat-icon>refresh</mat-icon>
          تحديث
        </button>
      </div>

      <div *ngIf="loading" class="text-center py-5">
        <mat-spinner></mat-spinner>
        <p class="mt-3">جاري تحميل الجدول الدراسي...</p>
      </div>

      <div class="row" *ngIf="!loading">
        <div class="col-12" *ngFor="let day of weekDays">
          <mat-card class="day-card" [ngClass]="getCurrentDayClass(day.key)">
            <mat-card-header>
              <mat-card-title>{{ day.name }}</mat-card-title>
              <span class="current-day-badge" *ngIf="getCurrentDayClass(day.key)">اليوم</span>
            </mat-card-header>

            <mat-card-content>
              <div class="schedule-table-container">
                <table mat-table [dataSource]="getScheduleForDay(day.key)" class="schedule-table">
                  <!-- Time Column -->
                  <ng-container matColumnDef="time">
                    <th mat-header-cell *matHeaderCellDef>الوقت</th>
                    <td mat-cell *matCellDef="let element" class="time-cell">
                      <div class="time-slot">
                        <span class="start-time">{{ element.startTime }}</span>
                        <span class="time-separator">-</span>
                        <span class="end-time">{{ element.endTime }}</span>
                      </div>
                    </td>
                  </ng-container>

                  <!-- Subject Column -->
                  <ng-container matColumnDef="subject">
                    <th mat-header-cell *matHeaderCellDef>المادة</th>
                    <td mat-cell *matCellDef="let element" class="subject-cell">
                      <div class="subject-info">
                        <mat-icon class="subject-icon">book</mat-icon>
                        <span class="subject-name">{{ element.subjectName }}</span>
                      </div>
                    </td>
                  </ng-container>

                  <!-- Class Column -->
                  <ng-container matColumnDef="class">
                    <th mat-header-cell *matHeaderCellDef>الصف</th>
                    <td mat-cell *matCellDef="let element" class="class-cell">
                      <div class="class-info">
                        <mat-icon class="class-icon">school</mat-icon>
                        <span>{{ element.className }}</span>
                      </div>
                    </td>
                  </ng-container>

                  <!-- Room Column -->
                  <ng-container matColumnDef="room">
                    <th mat-header-cell *matHeaderCellDef>القاعة</th>
                    <td mat-cell *matCellDef="let element" class="room-cell">
                      <div class="room-info">
                        <mat-icon class="room-icon">room</mat-icon>
                        <span>{{ element.room }}</span>
                      </div>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="schedule-row"></tr>
                </table>

                <div class="no-classes" *ngIf="getScheduleForDay(day.key).length === 0">
                  <mat-icon>event_busy</mat-icon>
                  <p>لا توجد حصص في هذا اليوم</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </app-layout>
  `,
  styles: [`
    .day-card {
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      
      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      
      &.current-day {
        border-right: 4px solid #4caf50;
        background: linear-gradient(270deg, #e8f5e8 0%, #ffffff 10%);
      }
    }

    .mat-card-header {
      padding: 16px 24px;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .current-day-badge {
      background: #4caf50;
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .schedule-table {
      width: 100%;
    }

    .time-cell {
      min-width: 120px;
      
      .time-slot {
        display: flex;
        align-items: center;
        font-weight: 600;
        color: #1976d2;
        
        .time-separator {
          margin: 0 8px;
          color: #666;
        }
      }
    }

    .subject-cell,
    .class-cell,
    .room-cell {
      .subject-info,
      .class-info,
      .room-info {
        display: flex;
        align-items: center;
        gap: 8px;
        
        .subject-icon,
        .class-icon,
        .room-icon {
          color: #1976d2;
          font-size: 18px;
        }
      }
    }

    .no-classes {
      text-align: center;
      padding: 3rem 1rem;
      color: #999;
      
      mat-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: #ddd;
      }
    }
  `]
})
export class TeacherScheduleComponent implements OnInit {
  currentUser: User | null = null;
  schedule: Schedule[] = [];
  loading = false;
  displayedColumns: string[] = ['time', 'subject', 'class', 'room'];
  
  weekDays = [
    { key: 'الأحد', name: 'الأحد' },
    { key: 'الاثنين', name: 'الاثنين' },
    { key: 'الثلاثاء', name: 'الثلاثاء' },
    { key: 'الأربعاء', name: 'الأربعاء' },
    { key: 'الخميس', name: 'الخميس' }
  ];

  constructor(
    private authService: AuthService,
    private scheduleService: ScheduleService,
    private teacherService: TeacherService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadSchedule();
      }
    });
  }

  loadSchedule(): void {
    if (!this.currentUser) return;

    this.loading = true;
    
    this.teacherService.getTeacher(this.currentUser.id)
      .pipe(
        catchError(error => {
          console.error('Error loading teacher:', error);
          return of(null);
        })
      )
      .subscribe(teacher => {
        if (teacher) {
          this.scheduleService.getTeacherSchedule(teacher.id)
            .pipe(
              catchError(error => {
                console.error('Error loading schedule:', error);
                return of([]);
              }),
              finalize(() => this.loading = false)
            )
            .subscribe(scheduleData => {
              this.schedule = scheduleData;
            });
        } else {
          this.loading = false;
        }
      });
  }

  getScheduleForDay(day: string): Schedule[] {
    return this.schedule.filter(item => item.dayOfWeek === day);
  }

  getCurrentDayClass(day: string): string {
    const today = new Date();
    const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const currentDay = dayNames[today.getDay()];
    return day === currentDay ? 'current-day' : '';
  }
}