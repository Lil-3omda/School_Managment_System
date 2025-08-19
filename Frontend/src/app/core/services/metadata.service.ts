import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface KeyValueItem {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class MetadataService {
  private readonly API_URL = `${environment.apiUrl}/metadata`;

  constructor(private http: HttpClient) {}

  getGenders(): Observable<KeyValueItem[]> {
    return this.http.get<KeyValueItem[]>(`${this.API_URL}/genders`);
  }

  getSalaryTypes(): Observable<KeyValueItem[]> {
    return this.http.get<KeyValueItem[]>(`${this.API_URL}/salary-types`);
  }

  getAttendanceStatuses(): Observable<KeyValueItem[]> {
    return this.http.get<KeyValueItem[]>(`${this.API_URL}/attendance-statuses`);
  }

  getSalaryStatuses(): Observable<KeyValueItem[]> {
    return this.http.get<KeyValueItem[]>(`${this.API_URL}/salary-statuses`);
  }

  getExamTypes(): Observable<KeyValueItem[]> {
    return this.http.get<KeyValueItem[]>(`${this.API_URL}/exam-types`);
  }
}

