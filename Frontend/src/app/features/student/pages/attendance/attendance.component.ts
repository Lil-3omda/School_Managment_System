import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../../../shared/components/layout/layout.component';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';

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

  constructor(private authService: AuthService) {}

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
    // Mock data - replace with actual API call
    setTimeout(() => {
      this.attendanceRecords = [
        {
          id: 1,
          date: new Date('2024-01-15'),
          subject: 'الرياضيات',
          teacher: 'أ. أحمد محمد',
          status: 'present',
          period: 1
        },
        {
          id: 2,
          date: new Date('2024-01-15'),
          subject: 'اللغة العربية',
          teacher: 'أ. فاطمة علي',
          status: 'present',
          period: 2
        },
        {
          id: 3,
          date: new Date('2024-01-16'),
          subject: 'العلوم',
          teacher: 'أ. محمد حسن',
          status: 'late',
          period: 1,
          notes: 'تأخير 10 دقائق'
        },
        {
          id: 4,
          date: new Date('2024-01-16'),
          subject: 'التاريخ',
          teacher: 'أ. سارة أحمد',
          status: 'absent',
          period: 3,
          notes: 'غياب بعذر طبي'
        },
        {
          id: 5,
          date: new Date('2024-01-17'),
          subject: 'الرياضيات',
          teacher: 'أ. أحمد محمد',
          status: 'present',
          period: 1
        }
      ];
      this.loading = false;
    }, 1000);
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