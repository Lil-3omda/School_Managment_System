import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

export interface Teacher {
  id: number;
  userId: number;
  employeeNumber: string;
  hireDate: Date;
  qualification: string;
  specialization: string;
  baseSalary: number;
  salaryType: number;
  hourlyRate: number;
  user: User;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateTeacherRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  gender: number;
  address: string;
  employeeNumber: string;
  hireDate: Date;
  qualification: string;
  specialization: string;
  baseSalary: number;
  salaryType: number;
  hourlyRate: number;
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