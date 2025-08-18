import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Subject {
  id: number;
  name: string;
  code: string;
  description: string;
  credits: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateSubjectRequest {
  name: string;
  code: string;
  description: string;
  credits: number;
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
export class SubjectService {
  private readonly API_URL = `${environment.apiUrl}/subjects`;

  constructor(private http: HttpClient) {}

  getSubjects(pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<Subject>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<PagedResult<Subject>>(this.API_URL, { params });
  }

  getSubject(id: number): Observable<Subject> {
    return this.http.get<Subject>(`${this.API_URL}/${id}`);
  }

  createSubject(subject: CreateSubjectRequest): Observable<Subject> {
    return this.http.post<Subject>(this.API_URL, subject);
  }

  updateSubject(id: number, subject: CreateSubjectRequest): Observable<Subject> {
    return this.http.put<Subject>(`${this.API_URL}/${id}`, subject);
  }

  deleteSubject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}