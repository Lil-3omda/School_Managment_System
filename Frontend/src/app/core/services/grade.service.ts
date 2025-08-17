import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Grade {
  id: number;
  studentId: number;
  studentName: string;
  examId: number;
  examName: string;
  subjectName: string;
  marksObtained: number;
  totalMarks: number;
  gradeValue: string;
  isPassed: boolean;
  remarks: string;
  examDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGradeRequest {
  studentId: number;
  examId: number;
  marksObtained: number;
  gradeValue: string;
  isPassed: boolean;
  remarks?: string;
}

export interface PagedResult<T> {
  data: T[];
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
export class GradeService {
  private readonly API_URL = `${environment.apiUrl}/grades`;

  constructor(private http: HttpClient) {}

  getGradesByStudent(studentId: number, pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<Grade>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<PagedResult<Grade>>(`${this.API_URL}/student/${studentId}`, { params });
  }

  getGradesByExam(examId: number, pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<Grade>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<PagedResult<Grade>>(`${this.API_URL}/exam/${examId}`, { params });
  }

  createGrade(grade: CreateGradeRequest): Observable<Grade> {
    return this.http.post<Grade>(this.API_URL, grade);
  }

  updateGrade(id: number, grade: CreateGradeRequest): Observable<Grade> {
    return this.http.put<Grade>(`${this.API_URL}/${id}`, grade);
  }

  deleteGrade(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}