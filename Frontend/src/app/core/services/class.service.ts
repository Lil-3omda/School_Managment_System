import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Class {
  id: number;
  name: string;
  description: string;
  capacity: number;
  room: string;
  startTime: string;
  endTime: string;
  studentCount: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateClassRequest {
  name: string;
  description: string;
  capacity: number;
  room: string;
  startTime: string;
  endTime: string;
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
export class ClassService {
  private readonly API_URL = `${environment.apiUrl}/classes`;

  constructor(private http: HttpClient) {}

  getClasses(pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<Class>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<PagedResult<Class>>(this.API_URL, { params });
  }

  getClass(id: number): Observable<Class> {
    return this.http.get<Class>(`${this.API_URL}/${id}`);
  }

  createClass(classData: CreateClassRequest): Observable<Class> {
    return this.http.post<Class>(this.API_URL, classData);
  }

  updateClass(id: number, classData: CreateClassRequest): Observable<Class> {
    return this.http.put<Class>(`${this.API_URL}/${id}`, classData);
  }

  deleteClass(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  getClassesByTeacher(teacherId: number): Observable<Class[]> {
    return this.http.get<Class[]>(`${this.API_URL}/teacher/${teacherId}`);
  }
}