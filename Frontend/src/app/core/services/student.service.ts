import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Student, CreateStudentRequest, PagedResult } from '../models/student.model';

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
    
    return this.http.get<PagedResult<Student>>(this.API_URL, { params });
  }

  getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.API_URL}/${id}`);
  }

  createStudent(student: CreateStudentRequest): Observable<Student> {
    return this.http.post<Student>(this.API_URL, student);
  }

  updateStudent(id: number, student: CreateStudentRequest): Observable<Student> {
    return this.http.put<Student>(`${this.API_URL}/${id}`, student);
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}