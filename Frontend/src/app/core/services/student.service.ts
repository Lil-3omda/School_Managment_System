import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student, CreateStudentRequest, PagedResult } from '../models/student.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly API_URL = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) {}

  getStudents(pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<Student>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<PagedResult<Student>>(this.API_URL, { params }).pipe(
      map(response => ({
        ...response,
        items: response.data || response.items || []
      }))
    );
  }

  getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.API_URL}/${id}`);
  }

  createStudent(student: CreateStudentRequest): Observable<Student> {
    return this.http.post<Student>(this.API_URL, student);
  }

  updateStudent(id: number, student: CreateStudentRequest): Observable<Student> {
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}

import { map } from 'rxjs/operators';
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}