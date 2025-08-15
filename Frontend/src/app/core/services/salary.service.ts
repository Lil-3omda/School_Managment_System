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
  allowances: number;
  deductions: number;
  netSalary: number;
  paymentDate: Date;
  status: number; // 1: Pending, 2: Paid, 3: Cancelled
  remarks: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSalaryRequest {
  teacherId: number;
  month: number;
  year: number;
  baseSalary: number;
  allowances: number;
  deductions: number;
  paymentDate: Date;
  remarks?: string;
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

  getSalaryRecord(id: number): Observable<SalaryRecord> {
    return this.http.get<SalaryRecord>(`${this.API_URL}/${id}`);
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