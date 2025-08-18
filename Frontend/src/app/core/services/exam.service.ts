import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Exam {
  id: number;
  title: string;
  description: string;
  subjectId: number;
  subjectName: string;
  classId: number;
  className: string;
  examDate: Date;
  duration: number; // in minutes
  totalMarks: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExamRequest {
  title: string;
  description: string;
  subjectId: number;
  classId: number;
  examDate: Date;
  duration: number;
  totalMarks: number;
}

export interface PagedResult<T> {
  data: T[];
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private readonly API_URL = `${environment.apiUrl}/exams`;

  constructor(private http: HttpClient) {}

  getExams(pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<Exam>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<PagedResult<Exam>>(this.API_URL, { params });
  }

  getExam(id: number): Observable<Exam> {
    return this.http.get<Exam>(`${this.API_URL}/${id}`);
  }

  createExam(exam: CreateExamRequest): Observable<Exam> {
    return this.http.post<Exam>(this.API_URL, exam);
  }

  updateExam(id: number, exam: CreateExamRequest): Observable<Exam> {
    return this.http.put<Exam>(`${this.API_URL}/${id}`, exam);
  }

  deleteExam(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  getExamsByTeacher(teacherId: number, pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<Exam>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<PagedResult<Exam>>(`${this.API_URL}/teacher/${teacherId}`, { params });
  }

  getUpcomingExamsForStudent(studentId: number): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${this.API_URL}/upcoming/student/${studentId}`);
  }
}