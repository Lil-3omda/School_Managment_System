import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface StudentPaymentDialogData {
  student?: any;
  availableClasses: any[];
  mode: 'add' | 'edit' | 'view';
}

export interface PaymentInfo {
  totalFees: number;
  paidAmount: number;
  remainingAmount: number;
  paymentDate: Date;
  paymentMethod: string;
  receiptNumber: string;
}

@Component({
  selector: 'app-student-payment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>
      <i class="fas fa-user-graduate me-2"></i>
      {{ getTitle() }}
    </h2>

    <mat-dialog-content>
      <form [formGroup]="studentForm">
        <!-- Personal Information -->
        <h6 class="section-title">المعلومات الشخصية</h6>
        <div class="row">
          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>الاسم الأول</mat-label>
              <input matInput formControlName="firstName" [readonly]="data.mode === 'view'">
              <mat-error *ngIf="studentForm.get('firstName')?.hasError('required')">
                الاسم الأول مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>الاسم الأخير</mat-label>
              <input matInput formControlName="lastName" [readonly]="data.mode === 'view'">
              <mat-error *ngIf="studentForm.get('lastName')?.hasError('required')">
                الاسم الأخير مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>البريد الإلكتروني</mat-label>
              <input matInput type="email" formControlName="email" [readonly]="data.mode === 'view'">
              <mat-error *ngIf="studentForm.get('email')?.hasError('required')">
                البريد الإلكتروني مطلوب
              </mat-error>
              <mat-error *ngIf="studentForm.get('email')?.hasError('email')">
                البريد الإلكتروني غير صحيح
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>رقم الهاتف</mat-label>
              <input matInput formControlName="phoneNumber" [readonly]="data.mode === 'view'">
              <mat-error *ngIf="studentForm.get('phoneNumber')?.hasError('required')">
                رقم الهاتف مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>رقم الطالب</mat-label>
              <input matInput formControlName="studentNumber" [readonly]="data.mode === 'view'">
              <mat-error *ngIf="studentForm.get('studentNumber')?.hasError('required')">
                رقم الطالب مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>الصف</mat-label>
              <mat-select formControlName="classId" [disabled]="data.mode === 'view'" (selectionChange)="onClassChange()">
                <mat-option *ngFor="let class of data.availableClasses" [value]="class.id">
                  {{ class.name }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="studentForm.get('classId')?.hasError('required')">
                الصف مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>تاريخ الميلاد</mat-label>
              <input matInput [matDatepicker]="birthPicker" formControlName="dateOfBirth" 
                     [readonly]="data.mode === 'view'">
              <mat-datepicker-toggle matSuffix [for]="birthPicker"></mat-datepicker-toggle>
              <mat-datepicker #birthPicker></mat-datepicker>
              <mat-error *ngIf="studentForm.get('dateOfBirth')?.hasError('required')">
                تاريخ الميلاد مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>الجنس</mat-label>
              <mat-select formControlName="gender" [disabled]="data.mode === 'view'">
                <mat-option value="1">ذكر</mat-option>
                <mat-option value="2">أنثى</mat-option>
              </mat-select>
              <mat-error *ngIf="studentForm.get('gender')?.hasError('required')">
                الجنس مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-12 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>العنوان</mat-label>
              <textarea matInput formControlName="address" rows="2" 
                        [readonly]="data.mode === 'view'"></textarea>
              <mat-error *ngIf="studentForm.get('address')?.hasError('required')">
                العنوان مطلوب
              </mat-error>
            </mat-form-field>
          </div>
        </div>

        <!-- Guardian Information -->
        <h6 class="section-title">معلومات ولي الأمر</h6>
        <div class="row">
          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>اسم ولي الأمر</mat-label>
              <input matInput formControlName="guardianName" [readonly]="data.mode === 'view'">
              <mat-error *ngIf="studentForm.get('guardianName')?.hasError('required')">
                اسم ولي الأمر مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>هاتف ولي الأمر</mat-label>
              <input matInput formControlName="guardianPhone" [readonly]="data.mode === 'view'">
              <mat-error *ngIf="studentForm.get('guardianPhone')?.hasError('required')">
                هاتف ولي الأمر مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>بريد ولي الأمر</mat-label>
              <input matInput type="email" formControlName="guardianEmail" [readonly]="data.mode === 'view'">
              <mat-error *ngIf="studentForm.get('guardianEmail')?.hasError('required')">
                بريد ولي الأمر مطلوب
              </mat-error>
              <mat-error *ngIf="studentForm.get('guardianEmail')?.hasError('email')">
                البريد الإلكتروني غير صحيح
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>تاريخ التسجيل</mat-label>
              <input matInput [matDatepicker]="enrollmentPicker" formControlName="enrollmentDate" 
                     [readonly]="data.mode === 'view'">
              <mat-datepicker-toggle matSuffix [for]="enrollmentPicker"></mat-datepicker-toggle>
              <mat-datepicker #enrollmentPicker></mat-datepicker>
              <mat-error *ngIf="studentForm.get('enrollmentDate')?.hasError('required')">
                تاريخ التسجيل مطلوب
              </mat-error>
            </mat-form-field>
          </div>
        </div>

        <!-- Payment Information -->
        <h6 class="section-title">معلومات الدفع</h6>
        <div class="row">
          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>إجمالي الرسوم</mat-label>
              <input matInput type="number" formControlName="totalFees" 
                     [readonly]="data.mode === 'view'" min="0" (input)="calculateRemaining()">
              <mat-error *ngIf="studentForm.get('totalFees')?.hasError('required')">
                إجمالي الرسوم مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>المبلغ المدفوع</mat-label>
              <input matInput type="number" formControlName="paidAmount" 
                     [readonly]="data.mode === 'view'" min="0" (input)="calculateRemaining()">
              <mat-error *ngIf="studentForm.get('paidAmount')?.hasError('required')">
                المبلغ المدفوع مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>المبلغ المتبقي</mat-label>
              <input matInput type="number" formControlName="remainingAmount" 
                     [readonly]="true" class="remaining-amount">
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>طريقة الدفع</mat-label>
              <mat-select formControlName="paymentMethod" [disabled]="data.mode === 'view'">
                <mat-option value="cash">نقداً</mat-option>
                <mat-option value="card">بطاقة ائتمان</mat-option>
                <mat-option value="bank_transfer">تحويل بنكي</mat-option>
                <mat-option value="check">شيك</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>تاريخ الدفع</mat-label>
              <input matInput [matDatepicker]="paymentPicker" formControlName="paymentDate" 
                     [readonly]="data.mode === 'view'">
              <mat-datepicker-toggle matSuffix [for]="paymentPicker"></mat-datepicker-toggle>
              <mat-datepicker #paymentPicker></mat-datepicker>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>رقم الإيصال</mat-label>
              <input matInput formControlName="receiptNumber" [readonly]="true" 
                     [value]="generateReceiptNumber()">
            </mat-form-field>
          </div>
        </div>
      </form>

      <!-- Payment Summary -->
      <div class="payment-summary" *ngIf="data.mode !== 'view'">
        <h6>ملخص الدفع</h6>
        <div class="summary-card">
          <div class="summary-row">
            <span>إجمالي الرسوم:</span>
            <span class="amount">{{ studentForm.get('totalFees')?.value || 0 | currency:'SAR':'symbol':'1.0-0' }}</span>
          </div>
          <div class="summary-row">
            <span>المبلغ المدفوع:</span>
            <span class="amount paid">{{ studentForm.get('paidAmount')?.value || 0 | currency:'SAR':'symbol':'1.0-0' }}</span>
          </div>
          <div class="summary-row total">
            <span>المبلغ المتبقي:</span>
            <span class="amount remaining">{{ studentForm.get('remainingAmount')?.value || 0 | currency:'SAR':'symbol':'1.0-0' }}</span>
          </div>
        </div>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">
        {{ data.mode === 'view' ? 'إغلاق' : 'إلغاء' }}
      </button>
      <button mat-raised-button color="accent" 
              (click)="printReceipt()" 
              *ngIf="data.mode !== 'add' && studentForm.get('paidAmount')?.value > 0">
        <i class="fas fa-print me-2"></i>
        طباعة الإيصال
      </button>
      <button mat-raised-button color="primary" 
              (click)="onSave()" 
              [disabled]="studentForm.invalid || loading"
              *ngIf="data.mode !== 'view'">
        <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
        <i class="fas fa-save me-2" *ngIf="!loading"></i>
        {{ loading ? 'جاري الحفظ...' : 'حفظ وطباعة الإيصال' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .mat-dialog-content {
      min-width: 800px;
      max-height: 80vh;
      overflow-y: auto;
    }

    .section-title {
      color: #1976d2;
      border-bottom: 2px solid #e3f2fd;
      padding-bottom: 0.5rem;
      margin-bottom: 1rem;
      font-weight: 600;
    }

    .remaining-amount {
      font-weight: bold;
      background-color: #fff3cd !important;
    }

    .payment-summary {
      margin-top: 2rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #dee2e6;
    }

    .summary-card {
      background: white;
      padding: 1rem;
      border-radius: 6px;
      border: 1px solid #e9ecef;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f1f3f4;
    }

    .summary-row:last-child {
      border-bottom: none;
    }

    .summary-row.total {
      font-weight: bold;
      font-size: 1.1rem;
      border-top: 2px solid #1976d2;
      margin-top: 0.5rem;
      padding-top: 1rem;
    }

    .amount {
      font-weight: 600;
    }

    .amount.paid {
      color: #28a745;
    }

    .amount.remaining {
      color: #dc3545;
    }

    @media (max-width: 768px) {
      .mat-dialog-content {
        min-width: 300px;
      }
    }
  `]
})
export class StudentPaymentDialogComponent implements OnInit {
  studentForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StudentPaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StudentPaymentDialogData
  ) {
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      studentNumber: ['', Validators.required],
      classId: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      guardianName: ['', Validators.required],
      guardianPhone: ['', Validators.required],
      guardianEmail: ['', [Validators.required, Validators.email]],
      enrollmentDate: [new Date(), Validators.required],
      totalFees: [0, [Validators.required, Validators.min(0)]],
      paidAmount: [0, [Validators.required, Validators.min(0)]],
      remainingAmount: [0],
      paymentMethod: ['cash'],
      paymentDate: [new Date()],
      receiptNumber: ['']
    });
  }

  ngOnInit(): void {
    if (this.data.student && this.data.mode !== 'add') {
      this.studentForm.patchValue({
        firstName: this.data.student.user?.firstName,
        lastName: this.data.student.user?.lastName,
        email: this.data.student.user?.email,
        phoneNumber: this.data.student.user?.phoneNumber,
        studentNumber: this.data.student.studentNumber,
        classId: this.data.student.classId,
        dateOfBirth: new Date(this.data.student.user?.dateOfBirth),
        gender: this.data.student.user?.gender.toString(),
        address: this.data.student.user?.address,
        guardianName: this.data.student.guardianName,
        guardianPhone: this.data.student.guardianPhone,
        guardianEmail: this.data.student.guardianEmail,
        enrollmentDate: new Date(this.data.student.enrollmentDate),
        totalFees: this.data.student.totalFees || 5000,
        paidAmount: this.data.student.paidAmount || 0,
        remainingAmount: this.data.student.remainingAmount || 5000,
        paymentMethod: this.data.student.paymentMethod || 'cash',
        paymentDate: this.data.student.paymentDate ? new Date(this.data.student.paymentDate) : new Date(),
        receiptNumber: this.data.student.receiptNumber || this.generateReceiptNumber()
      });
    } else {
      // Set default fees for new student
      this.onClassChange();
    }
    
    this.calculateRemaining();
  }

  getTitle(): string {
    switch (this.data.mode) {
      case 'add': return 'إضافة طالب جديد';
      case 'edit': return 'تعديل بيانات الطالب';
      case 'view': return 'عرض تفاصيل الطالب';
      default: return 'إدارة الطالب';
    }
  }

  onClassChange(): void {
    const classId = this.studentForm.get('classId')?.value;
    if (classId) {
      // Set default fees based on class
      const defaultFees = this.getClassFees(classId);
      this.studentForm.patchValue({
        totalFees: defaultFees,
        receiptNumber: this.generateReceiptNumber()
      });
      this.calculateRemaining();
    }
  }

  getClassFees(classId: number): number {
    // Default fees based on class - you can customize this
    const feesMap: { [key: number]: number } = {
      1: 5000, // الصف الأول
      2: 5500, // الصف الثاني
      3: 6000  // الصف الثالث
    };
    return feesMap[classId] || 5000;
  }

  calculateRemaining(): void {
    const totalFees = this.studentForm.get('totalFees')?.value || 0;
    const paidAmount = this.studentForm.get('paidAmount')?.value || 0;
    
    const remaining = parseFloat(totalFees) - parseFloat(paidAmount);
    this.studentForm.patchValue({ remainingAmount: remaining }, { emitEvent: false });
  }

  generateReceiptNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `REC-${year}${month}${day}-${random}`;
  }

  printReceipt(): void {
    const receiptData = {
      studentName: `${this.studentForm.get('firstName')?.value} ${this.studentForm.get('lastName')?.value}`,
      studentNumber: this.studentForm.get('studentNumber')?.value,
      className: this.getClassName(),
      totalFees: this.studentForm.get('totalFees')?.value,
      paidAmount: this.studentForm.get('paidAmount')?.value,
      remainingAmount: this.studentForm.get('remainingAmount')?.value,
      paymentMethod: this.studentForm.get('paymentMethod')?.value,
      paymentDate: this.studentForm.get('paymentDate')?.value,
      receiptNumber: this.studentForm.get('receiptNumber')?.value
    };

    this.generatePrintableReceipt(receiptData);
  }

  private getClassName(): string {
    const classId = this.studentForm.get('classId')?.value;
    const selectedClass = this.data.availableClasses.find(c => c.id == classId);
    return selectedClass?.name || '';
  }

  private generatePrintableReceipt(data: any): void {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html dir="rtl">
        <head>
          <title>إيصال دفع - ${data.receiptNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; direction: rtl; text-align: right; }
            .receipt { max-width: 600px; margin: 20px auto; padding: 20px; border: 2px solid #333; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
            .row { display: flex; justify-content: space-between; margin: 10px 0; }
            .total { font-weight: bold; font-size: 1.2em; border-top: 2px solid #333; padding-top: 10px; }
            .footer { text-align: center; margin-top: 30px; font-size: 0.9em; color: #666; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h2>نظام إدارة المدرسة</h2>
              <h3>إيصال دفع رسوم دراسية</h3>
              <p>رقم الإيصال: ${data.receiptNumber}</p>
            </div>
            
            <div class="row"><span>اسم الطالب:</span><span>${data.studentName}</span></div>
            <div class="row"><span>رقم الطالب:</span><span>${data.studentNumber}</span></div>
            <div class="row"><span>الصف:</span><span>${data.className}</span></div>
            <div class="row"><span>تاريخ الدفع:</span><span>${new Date(data.paymentDate).toLocaleDateString('ar-SA')}</span></div>
            <div class="row"><span>طريقة الدفع:</span><span>${this.getPaymentMethodText(data.paymentMethod)}</span></div>
            
            <hr>
            
            <div class="row"><span>إجمالي الرسوم:</span><span>${data.totalFees} ريال</span></div>
            <div class="row"><span>المبلغ المدفوع:</span><span>${data.paidAmount} ريال</span></div>
            <div class="row total"><span>المبلغ المتبقي:</span><span>${data.remainingAmount} ريال</span></div>
            
            <div class="footer">
              <p>شكراً لكم على ثقتكم</p>
              <p>تاريخ الطباعة: ${new Date().toLocaleDateString('ar-SA')}</p>
            </div>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }

  private getPaymentMethodText(method: string): string {
    const methods: { [key: string]: string } = {
      'cash': 'نقداً',
      'card': 'بطاقة ائتمان',
      'bank_transfer': 'تحويل بنكي',
      'check': 'شيك'
    };
    return methods[method] || method;
  }

  onSave(): void {
    if (this.studentForm.valid) {
      this.loading = true;
      const formData = {
        ...this.studentForm.value,
        gender: parseInt(this.studentForm.value.gender)
      };
      
      setTimeout(() => {
        this.loading = false;
        this.dialogRef.close(formData);
        
        // Auto-print receipt if payment was made
        if (formData.paidAmount > 0) {
          this.printReceipt();
        }
      }, 1000);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}