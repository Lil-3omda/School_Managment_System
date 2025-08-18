import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SalaryRecord {
  id: number;
  teacherId: number;
  teacherName: string;
  month: number;
  year: number;
  baseSalary: number;
  hoursWorked: number;
  bonus: number;
  deductions: number;
  totalSalary: number;
  status: number;
  paidDate?: Date;
  createdAt: Date;
  updatedAt?: Date;
  allowances: number;
  netSalary: number;
}

export interface CreateSalaryRequest {
  teacherId: number;
  month: number;
  year: number;
  baseSalary: number;
  hoursWorked: number;
  bonus: number;
  deductions: number;
  totalSalary: number;
  status: number;
  paidDate?: Date;
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
export class SalaryService {
  private readonly API_URL = `${environment.apiUrl}/salaries`;

  constructor(private http: HttpClient) {}

  getSalaryRecords(pageNumber: number = 1, pageSize: number = 10, teacherId?: number, month?: number, year?: number): Observable<PagedResult<SalaryRecord>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    if (teacherId) {
      params = params.set('teacherId', teacherId.toString());
    }
    
    if (month) {
      params = params.set('month', month.toString());
    }
    
    if (year) {
      params = params.set('year', year.toString());
    }
    
    return this.http.get<PagedResult<SalaryRecord>>(this.API_URL, { params });
  }

  getTeacherSalaries(teacherId: number, pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<SalaryRecord>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<PagedResult<SalaryRecord>>(`${this.API_URL}/teacher/${teacherId}`, { params });
  }

  createSalaryRecord(salary: CreateSalaryRequest): Observable<SalaryRecord> {
    return this.http.post<SalaryRecord>(this.API_URL, salary);
  }

  updateSalaryRecord(id: number, salary: CreateSalaryRequest): Observable<SalaryRecord> {
    return this.http.put<SalaryRecord>(`${this.API_URL}/${id}`, salary);
  }

  deleteSalaryRecord(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  paySalary(id: number): Observable<SalaryRecord> {
    return this.http.patch<SalaryRecord>(`${this.API_URL}/${id}/pay`, {});
  }
}