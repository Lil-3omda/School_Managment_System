export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  gender: Gender;
  address: string;
  role: UserRole;
  isActive: boolean;
  fullName: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  expires: Date;
  user: User;
}

export enum Gender {
  Male = 1,
  Female = 2,
  Other = 3
}

export enum UserRole {
  Admin = 1,
  Teacher = 2,
  Student = 3
}