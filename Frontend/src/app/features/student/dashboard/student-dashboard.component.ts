import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { StudentService } from '../../../core/services/student.service';
import { GradeService } from '../../../core/services/grade.service';
import { ExamService } from '../../../core/services/exam.service';
import { ScheduleService } from '../../../core/services/schedule.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

interface StudentStats {
  gpa: number;
  attendanceRate: number;
  enrolledSubjects: number;
  upcomingExams: number;
}

interface Grade {
  subject: string;
  examType: string;
  score: number;
  totalScore: number;
  date: Date;
  isPassed: boolean;
}

interface Exam {
  subject: string;
  type: string;
  date: Date;
}

interface ClassSchedule {
  subject: string;
  teacher: string;
  time: string;
  room: string;
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    DatePipe,
    CommonModule,
    RouterModule,
    NavbarComponent
  ],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {
  currentUser: User | null = null;
  studentStats: StudentStats = {
    gpa: 0,
    attendanceRate: 0,
    enrolledSubjects: 0,
    upcomingExams: 0
  };

  recentGrades: Grade[] = [];
  upcomingExams: Exam[] = [];
  todaySchedule: ClassSchedule[] = [];

  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private gradeService: GradeService,
    private examService: ExamService,
    private scheduleService: ScheduleService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    this.loadStudentStats();
    this.loadRecentGrades();
    this.loadUpcomingExams();
    this.loadTodaySchedule();
  }

  private loadStudentStats(): void {
    if (this.currentUser) {
      // Load actual student data
      this.studentService.getStudent(this.currentUser.id)
        .pipe(
          catchError(error => {
            console.error('Error loading student stats:', error);
            return of(null);
          })
        )
        .subscribe(student => {
          if (student) {
            this.studentStats = {
              gpa: 3.75, // Calculate from grades
              attendanceRate: 92, // Calculate from attendance
              enrolledSubjects: 6, // Count from schedule
              upcomingExams: 3 // Count from exams
            };
          }
        });
    }
  }

  private loadRecentGrades(): void {
    if (this.currentUser) {
      // Get student ID from user
      this.studentService.getStudent(this.currentUser.id)
        .pipe(
          catchError(error => {
            console.error('Error loading student:', error);
            return of(null);
          })
        )
        .subscribe(student => {
          if (student) {
            this.gradeService.getGradesByStudent(student.id, 1, 5)
              .pipe(
                catchError(error => {
                  console.error('Error loading grades:', error);
                  return of({ data: [], totalCount: 0, pageNumber: 1, pageSize: 5, totalPages: 0, hasPreviousPage: false, hasNextPage: false });
                })
              )
              .subscribe(result => {
                this.recentGrades = result.data.map(grade => ({
                  subject: grade.subjectName,
                  examType: grade.examName,
                  score: grade.marksObtained,
                  totalScore: grade.totalMarks,
                  date: new Date(grade.examDate),
                  isPassed: grade.isPassed
                }));
              });
          }
        });
    }
  }

  private loadUpcomingExams(): void {
    if (this.currentUser) {
      this.studentService.getStudent(this.currentUser.id)
        .pipe(
          catchError(error => {
            console.error('Error loading student:', error);
            return of(null);
          })
        )
        .subscribe(student => {
          if (student) {
            this.examService.getUpcomingExamsForStudent(student.id)
              .pipe(
                catchError(error => {
                  console.error('Error loading upcoming exams:', error);
                  return of([]);
                })
              )
              .subscribe(exams => {
                this.upcomingExams = exams.map(exam => ({
                  subject: exam.subjectName,
                  type: this.getExamTypeText(exam.type),
                  date: new Date(exam.examDate)
                }));
              });
          }
        });
    }
  }

  private loadTodaySchedule(): void {
    if (this.currentUser) {
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
                })
              )
              .subscribe(schedule => {
                const today = new Date();
                const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
                const currentDay = dayNames[today.getDay()];
                
                this.todaySchedule = schedule
                  .filter(item => item.dayOfWeek === currentDay)
                  .map(item => ({
                    subject: item.subjectName,
                    teacher: item.teacherName,
                    time: `${item.startTime} - ${item.endTime}`,
                    room: item.room
                  }));
              });
          }
        });
    }
  }

  private getExamTypeText(type: number): string {
    const types = ['', 'اختبار قصير', 'امتحان نصفي', 'امتحان نهائي', 'واجب'];
    return types[type] || 'غير محدد';
  }

  getGradeStatusClass(isPassed: boolean): string {
    return isPassed ? 'bg-success' : 'bg-danger';
  }

  getDaysUntilExam(examDate: Date): number {
    const today = new Date();
    const diffTime = examDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}