import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Payment, CreatePaymentRequest } from '../models/payment.model';

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
export class PaymentService {
  private readonly API_URL = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  getPayments(pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<Payment>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<PagedResult<Payment>>(this.API_URL, { params });
  }

  getStudentPayments(studentId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.API_URL}/student/${studentId}`);
  }

  createPayment(payment: CreatePaymentRequest): Observable<Payment> {
    return this.http.post<Payment>(this.API_URL, payment);
  }

  updatePayment(id: number, payment: CreatePaymentRequest): Observable<Payment> {
    return this.http.put<Payment>(`${this.API_URL}/${id}`, payment);
  }

  deletePayment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  generateReceipt(paymentId: number): Observable<Blob> {
    return this.http.get(`${this.API_URL}/${paymentId}/receipt`, { 
      responseType: 'blob' 
    });
  }
}