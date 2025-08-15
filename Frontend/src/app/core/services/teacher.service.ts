import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Teacher {
  id: number;
  userId: number;
  teacherNumber: string;
  hireDate: Date;
  subjectId: number;
  subjectName: string;
  salary: number;
  isActive: boolean;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: Date;
    gender: number;
    address: string;
    role: number;
    isActive: boolean;
    fullName: string;
    createdAt: Date;
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTeacherRequest {
  userId: number;
  teacherNumber: string;
  hireDate: Date;
  subjectId: number;
  salary: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private readonly API_URL = `${environment.apiUrl}/teachers`;

  constructor(private http: HttpClient) {}

  getTeachers(pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<Teacher>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<PagedResult<Teacher>>(this.API_URL, { params });
  }

  getTeacher(id: number): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.API_URL}/${id}`);
  }

  createTeacher(teacher: CreateTeacherRequest): Observable<Teacher> {
    return this.http.post<Teacher>(this.API_URL, teacher);
  }

  updateTeacher(id: number, teacher: CreateTeacherRequest): Observable<Teacher> {
    return this.http.put<Teacher>(`${this.API_URL}/${id}`, teacher);
  }

  deleteTeacher(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}