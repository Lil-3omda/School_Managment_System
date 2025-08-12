import { UserRole, Gender } from './user.model';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  dateOfBirth: Date;
  gender: Gender;
  address: string;
  role: UserRole;
}