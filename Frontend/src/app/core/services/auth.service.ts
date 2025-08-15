import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError } from 'rxjs';
import { LoginRequest, LoginResponse, User } from '../models/user.model';
import { RegisterRequest } from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCurrentUser();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('AuthService: Attempting login to:', `${this.API_URL}/login`);
    console.log('AuthService: Credentials:', { email: credentials.email, password: '***' });
    
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          console.log('AuthService: Login response received:', response);
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }),
        catchError(error => {
          console.error('AuthService: Login error:', error);
          throw error;
        })
      );
  }

  register(registerData: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/register`, registerData)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        })
      );
  }

  forgetPassword(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/forget-password`, { email });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/me`);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.role.toString() === role;
  }

  private loadCurrentUser(): void {
    const userStr = localStorage.getItem('user');
    if (userStr && this.isAuthenticated()) {
      const user = JSON.parse(userStr);
      this.currentUserSubject.next(user);
    }
  }
}