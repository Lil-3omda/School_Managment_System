import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AttendanceRecord {
  id: number;
  date: Date;
  classId: number;
  className: string;
  studentId?: number;
  studentName?: string;
  teacherId?: number;
  teacherName?: string;
  status: number;
  remarks?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateAttendanceRequest {
  date: Date;
  classId: number;
  studentId?: number;
  teacherId?: number;
  status: number;
  remarks?: string;
}

export interface AttendanceReport {
  startDate: Date;
  endDate: Date;
  totalStudents: number;
  totalDays: number;
  overallAttendanceRate: number;
  classAttendance: ClassAttendanceDto[];
  studentAttendance: StudentAttendanceDto[];
}

export interface ClassAttendanceDto {
  classId: number;
  className: string;
  totalStudents: number;
  presentDays: number;
  absentDays: number;
  attendanceRate: number;
}

export interface StudentAttendanceDto {
  studentId: number;
  studentName: string;
  className: string;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  attendanceRate: number;
}

export interface PagedResult<T> {
  data: T[];
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private readonly API_URL = `${environment.apiUrl}/attendance`;

  constructor(private http: HttpClient) {}

  getAttendanceRecords(pageNumber: number = 1, pageSize: number = 10, classId?: number, date?: Date): Observable<PagedResult<AttendanceRecord>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    if (classId) {
      params = params.set('classId', classId.toString());
    }
    
    if (date) {
      params = params.set('date', date.toISOString());
    }
    
    return this.http.get<PagedResult<AttendanceRecord>>(this.API_URL, { params });
  }

  getStudentAttendance(studentId: number, pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<AttendanceRecord>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<PagedResult<AttendanceRecord>>(`${this.API_URL}/student/${studentId}`, { params });
  }

  getAttendanceReport(classId?: number, startDate?: Date, endDate?: Date): Observable<AttendanceReport> {
    let params = new HttpParams();
    
    if (startDate) {
      params = params.set('startDate', startDate.toISOString());
    }
    
    if (endDate) {
      params = params.set('endDate', endDate.toISOString());
    }
    
    if (classId) {
      params = params.set('classId', classId.toString());
    }
    
    return this.http.get<AttendanceReport>(`${this.API_URL}/reports`, { params });
  }

  createAttendanceRecord(attendance: CreateAttendanceRequest): Observable<AttendanceRecord> {
    return this.http.post<AttendanceRecord>(this.API_URL, attendance);
  }

  updateAttendanceRecord(id: number, attendance: CreateAttendanceRequest): Observable<AttendanceRecord> {
    return this.http.put<AttendanceRecord>(`${this.API_URL}/${id}`, attendance);
  }

  deleteAttendanceRecord(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}