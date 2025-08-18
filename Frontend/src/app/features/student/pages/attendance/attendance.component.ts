import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../../../shared/components/layout/layout.component';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';
import { AttendanceService } from '../../../../core/services/attendance.service';
import { StudentService } from '../../../../core/services/student.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

interface AttendanceRecord {
  id: number;
  date: Date;
  subject: string;
  teacher: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  period: number;
  notes?: string;
}

@Component({
  selector: 'app-student-attendance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LayoutComponent
  ],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class StudentAttendanceComponent implements OnInit {
  currentUser: User | null = null;
  attendanceRecords: AttendanceRecord[] = [];
  loading = false;
  selectedMonth = new Date().getMonth();
  selectedYear = new Date().getFullYear();
  selectedSubject = 'all';

  months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  constructor(
    private authService: AuthService,
    private attendanceService: AttendanceService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadAttendance();
      }
    });
  }

  loadAttendance(): void {
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
          this.attendanceService.getStudentAttendance(student.id, 1, 100)
            .pipe(
              catchError(error => {
                console.error('Error loading attendance:', error);
                return of({ data: [], totalCount: 0, pageNumber: 1, pageSize: 100, totalPages: 0, hasPreviousPage: false, hasNextPage: false });
              }),
              finalize(() => this.loading = false)
            )
            .subscribe(result => {
              this.attendanceRecords = result.data.map(record => ({
                id: record.id,
                date: new Date(record.date),
                subject: 'المادة', // TODO: Get from schedule
                teacher: record.teacherName || 'غير محدد',
                status: this.mapStatusToString(record.status),
                period: 1, // TODO: Get from schedule
                notes: record.remarks
              }));
            });
        } else {
          this.loading = false;
        }
      });
  }

  private mapStatusToString(status: number): 'present' | 'absent' | 'late' | 'excused' {
    switch (status) {
      case 1: return 'present';
      case 2: return 'absent';
      case 3: return 'late';
      case 4: return 'excused';
      default: return 'absent';
    }
  }

  getFilteredRecords(): AttendanceRecord[] {
    return this.attendanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      const monthMatch = recordDate.getMonth() === this.selectedMonth;
      const yearMatch = recordDate.getFullYear() === this.selectedYear;
      const subjectMatch = this.selectedSubject === 'all' || record.subject === this.selectedSubject;
      
      return monthMatch && yearMatch && subjectMatch;
    });
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'present': return 'حاضر';
      case 'absent': return 'غائب';
      case 'late': return 'متأخر';
      case 'excused': return 'غياب بعذر';
      default: return 'غير محدد';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'present': return 'badge bg-success';
      case 'absent': return 'badge bg-danger';
      case 'late': return 'badge bg-warning';
      case 'excused': return 'badge bg-info';
      default: return 'badge bg-secondary';
    }
  }

  getAttendanceStats() {
    const filtered = this.getFilteredRecords();
    const total = filtered.length;
    const present = filtered.filter(r => r.status === 'present').length;
    const absent = filtered.filter(r => r.status === 'absent').length;
    const late = filtered.filter(r => r.status === 'late').length;
    const excused = filtered.filter(r => r.status === 'excused').length;
    
    return {
      total,
      present,
      absent,
      late,
      excused,
      attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0
    };
  }

  getUniqueSubjects(): string[] {
    return [...new Set(this.attendanceRecords.map(record => record.subject))];
  }

  getYears(): number[] {
    const currentYear = new Date().getFullYear();
    return [currentYear - 1, currentYear, currentYear + 1];
  }
}