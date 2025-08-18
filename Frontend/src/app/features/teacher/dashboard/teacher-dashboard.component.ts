import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { TeacherService } from '../../../core/services/teacher.service';
import { ClassService } from '../../../core/services/class.service';
import { StudentService } from '../../../core/services/student.service';
import { ExamService } from '../../../core/services/exam.service';
import { ScheduleService } from '../../../core/services/schedule.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

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
    LayoutComponent
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

  constructor(
    private authService: AuthService,
    private router: Router,
    private teacherService: TeacherService,
    private classService: ClassService,
    private studentService: StudentService,
    private examService: ExamService,
    private scheduleService: ScheduleService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    this.loadTeacherStats();
    this.loadTodaySchedule();
    this.loadPendingTasks();
  }

  private loadTeacherStats(): void {
    if (this.currentUser) {
      // Get teacher data and calculate stats
      this.teacherService.getTeacher(this.currentUser.id)
        .pipe(
          catchError(error => {
            console.error('Error loading teacher stats:', error);
            return of(null);
          })
        )
        .subscribe(teacher => {
          if (teacher) {
            // Load classes for this teacher
            this.classService.getClassesByTeacher(teacher.id)
              .pipe(
                catchError(error => {
                  console.error('Error loading teacher classes:', error);
                  return of([]);
                })
              )
              .subscribe((classes: any[]) => {
                this.teacherStats = {
                  totalClasses: classes.length,
                  totalStudents: classes.reduce((sum, cls) => sum + (cls.studentCount || 0), 0),
                  monthlyExams: 8, // TODO: Calculate from exams
                  averageAttendance: 88 // TODO: Calculate from attendance
                };
              });
          }
        });
    }
  }

  private loadTodaySchedule(): void {
    if (this.currentUser) {
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
                })
              )
              .subscribe(schedule => {
                const today = new Date();
                const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
                const currentDay = dayNames[today.getDay()];
                
                this.todaySchedule = schedule
                  .filter(item => item.dayOfWeek === currentDay)
                  .map(item => ({
                    time: `${item.startTime} - ${item.endTime}`,
                    subject: item.subjectName,
                    className: item.className,
                    room: item.room
                  }));
              });
          }
        });
    }
  }

  private loadPendingTasks(): void {
    if (this.currentUser) {
      // Load pending tasks from exams and grades
      this.teacherService.getTeacher(this.currentUser.id)
        .pipe(
          catchError(error => {
            console.error('Error loading teacher:', error);
            return of(null);
          })
        )
        .subscribe(teacher => {
          if (teacher) {
            this.examService.getExamsByTeacher(teacher.id, 1, 10)
              .pipe(
                catchError(error => {
                  console.error('Error loading teacher exams:', error);
                  return of({ data: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0, hasPreviousPage: false, hasNextPage: false });
                })
              )
              .subscribe(result => {
                const upcomingExams = result.data.filter(exam => new Date(exam.examDate) > new Date());
                this.pendingTasks = upcomingExams.map(exam => ({
                  title: `إعداد ${exam.name}`,
                  description: `${exam.subjectName} - ${exam.className}`,
                  dueDate: new Date(exam.examDate),
                  priority: this.getExamPriority(new Date(exam.examDate))
                }));
              });
          }
        });
    }
  }

  private getExamPriority(examDate: Date): string {
    const daysUntil = Math.ceil((examDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil <= 3) return 'عالي';
    if (daysUntil <= 7) return 'متوسط';
    return 'منخفض';
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

  addGrades(): void {
    this.router.navigate(['/teacher/grades']);
  }

  markAttendance(): void {
    this.router.navigate(['/teacher/attendance']);
  }

  markAttendanceForClass(classItem: ClassSchedule): void {
    // Navigate to attendance page with class context
    this.router.navigate(['/teacher/attendance'], { 
      queryParams: { 
        subject: classItem.subject, 
        className: classItem.className,
        time: classItem.time 
      } 
    });
  }

  addGradesForClass(classItem: ClassSchedule): void {
    // Navigate to grades page with class context
    this.router.navigate(['/teacher/grades'], { 
      queryParams: { 
        subject: classItem.subject, 
        className: classItem.className 
      } 
    });
  }
}