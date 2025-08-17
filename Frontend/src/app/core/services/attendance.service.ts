import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AttendanceRecord {
  id: number;
  studentId: number;
  studentName: string;
  classId: number;
  className: string;
  date: Date;
  status: number; // 1: Present, 2: Absent, 3: Late, 4: Excused
  remarks: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendanceReport {
  classId: number;
  className: string;
  date: Date;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  attendancePercentage: number;
}

export interface CreateAttendanceRequest {
  studentId: number;
  classId: number;
  date: Date;
  status: number;
  remarks?: string;
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
    
    return this.http.get<PagedResult<AttendanceRecord>>(this.API_URL, { params }).pipe(
      map(response => ({
        ...response,
        items: response.data || response.items || []
      }))
    );
  }

  getAttendanceReport(classId: number, startDate: Date, endDate: Date): Observable<AttendanceReport[]> {
    const params = new HttpParams()
      .set('classId', classId.toString())
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());
    
    return this.http.get<AttendanceReport[]>(`${this.API_URL}/reports`, { params });
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

import { map } from 'rxjs/operators';
}