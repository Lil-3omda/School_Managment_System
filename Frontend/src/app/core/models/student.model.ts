import { User } from './user.model';

export interface Student {
  id: number;
  userId: number;
  studentNumber: string;
  enrollmentDate: Date;
  classId: number;
  className: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  user: User;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateStudentRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  gender: number;
  address: string;
  studentNumber: string;
  enrollmentDate: Date;
  classId: number;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
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