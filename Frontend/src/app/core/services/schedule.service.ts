import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Schedule {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  subjectName: string;
  className: string;
  teacherName: string;
  room: string;
  classId: number;
  subjectId: number;
  teacherId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private readonly API_URL = `${environment.apiUrl}/schedules`;

  constructor(private http: HttpClient) {}

  getStudentSchedule(studentId: number): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.API_URL}/student/${studentId}`);
  }

  getTeacherSchedule(teacherId: number): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.API_URL}/teacher/${teacherId}`);
  }

  getClassSchedule(classId: number): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.API_URL}/class/${classId}`);
  }
}