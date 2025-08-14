import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../core/services/auth.service';
import { ScheduleService } from '../../../../core/services/schedule.service';
import { User } from '../../../../core/models/user.model';

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
    private scheduleService: ScheduleService
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
    
    // Mock data for now
    this.schedule = [
      {
        id: 1,
        dayOfWeek: 'الأحد',
        startTime: '08:00',
        endTime: '09:00',
        subjectName: 'الرياضيات',
        teacherName: 'أ. محمد أحمد',
        room: 'قاعة 101'
      },
      {
        id: 2,
        dayOfWeek: 'الأحد',
        startTime: '09:15',
        endTime: '10:15',
        subjectName: 'العلوم',
        teacherName: 'أ. فاطمة علي',
        room: 'مختبر العلوم'
      },
      {
        id: 3,
        dayOfWeek: 'الأحد',
        startTime: '10:30',
        endTime: '11:30',
        subjectName: 'اللغة العربية',
        teacherName: 'أ. عبد الله حسن',
        room: 'قاعة 205'
      },
      {
        id: 4,
        dayOfWeek: 'الاثنين',
        startTime: '08:00',
        endTime: '09:00',
        subjectName: 'الفيزياء',
        teacherName: 'أ. سارة محمد',
        room: 'مختبر الفيزياء'
      },
      {
        id: 5,
        dayOfWeek: 'الاثنين',
        startTime: '09:15',
        endTime: '10:15',
        subjectName: 'الكيمياء',
        teacherName: 'أ. أحمد سالم',
        room: 'مختبر الكيمياء'
      },
      {
        id: 6,
        dayOfWeek: 'الثلاثاء',
        startTime: '08:00',
        endTime: '09:00',
        subjectName: 'التاريخ',
        teacherName: 'أ. نورا عبد الله',
        room: 'قاعة 301'
      }
    ];

    this.loading = false;
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