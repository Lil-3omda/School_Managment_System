import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LookupItem {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class LookupService {
  private readonly API_URL = `${environment.apiUrl}/lookups`;

  constructor(private http: HttpClient) {}

  getGenders(): Observable<LookupItem[]> {
    return this.http.get<LookupItem[]>(`${this.API_URL}/genders`);
  }

  getExamTypes(): Observable<LookupItem[]> {
    return this.http.get<LookupItem[]>(`${this.API_URL}/exam-types`);
  }

  getAttendanceStatuses(): Observable<LookupItem[]> {
    return this.http.get<LookupItem[]>(`${this.API_URL}/attendance-statuses`);
  }

  getSalaryStatuses(): Observable<LookupItem[]> {
    return this.http.get<LookupItem[]>(`${this.API_URL}/salary-statuses`);
  }

  getMonths(): Observable<LookupItem[]> {
    return this.http.get<LookupItem[]>(`${this.API_URL}/months`);
  }
}

