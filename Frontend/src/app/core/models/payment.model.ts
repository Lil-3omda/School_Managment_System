export interface Payment {
  id: number;
  studentId: number;
  totalFees: number;
  paidAmount: number;
  remainingAmount: number;
  paymentDate: Date;
  paymentMethod: string;
  receiptNumber: string;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreatePaymentRequest {
  studentId: number;
  totalFees: number;
  paidAmount: number;
  paymentMethod: string;
  paymentDate: Date;
}

export enum PaymentStatus {
  Pending = 1,
  Paid = 2,
  Partial = 3,
  Overdue = 4
}