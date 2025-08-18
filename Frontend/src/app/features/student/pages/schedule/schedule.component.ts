import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../core/services/auth.service';
import { ScheduleService } from '../../../../core/services/schedule.service';
import { User } from '../../../../core/models/user.model';
import { StudentService } from '../../../../core/services/student.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

interface ScheduleItem {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  subjectName: string;
  teacherName: string;
  room: string;
}

@Component({
  selector: 'app-student-schedule',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class StudentScheduleComponent implements OnInit {
  currentUser: User | null = null;
  schedule: ScheduleItem[] = [];
  loading = false;
  displayedColumns: string[] = ['time', 'subject', 'teacher', 'room'];
  
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
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadSchedule();
      }
    });
  }

  private loadSchedule(): void {
    this.loading = true;
    
    if (!this.currentUser) {
      this.loading = false;
      return;
    }

    this.studentService.getStudent(this.currentUser.id)
      .pipe(
        catchError(error => {
          console.error('Error loading student:', error);
          return of(null);
        })
      )
      .subscribe(student => {
        if (student) {
          this.scheduleService.getStudentSchedule(student.id)
            .pipe(
              catchError(error => {
                console.error('Error loading schedule:', error);
                return of([]);
              }),
              finalize(() => this.loading = false)
            )
            .subscribe(scheduleData => {
              this.schedule = scheduleData.map(item => ({
                id: item.id,
                dayOfWeek: item.dayOfWeek,
                startTime: item.startTime,
                endTime: item.endTime,
                subjectName: item.subjectName,
                teacherName: item.teacherName,
                room: item.room
              }));
            });
        } else {
          this.loading = false;
        }
      });
  }

  getScheduleForDay(day: string): ScheduleItem[] {
    return this.schedule.filter(item => item.dayOfWeek === day);
  }

  getCurrentDayClass(day: string): string {
    const today = new Date();
    const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const currentDay = dayNames[today.getDay()];
    return day === currentDay ? 'current-day' : '';
  }
}