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

export interface SalaryDialogData {
  salary?: any;
  teachers: any[];
  mode: 'add' | 'edit' | 'view';
}

@Component({
  selector: 'app-salary-dialog',
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
      <i class="fas fa-money-bill-wave me-2"></i>
      {{ getTitle() }}
    </h2>

    <mat-dialog-content>
      <form [formGroup]="salaryForm">
        <div class="row">
          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>المعلم</mat-label>
              <mat-select formControlName="teacherId" [disabled]="data.mode === 'view'">
                <mat-option *ngFor="let teacher of data.teachers" [value]="teacher.id">
                  {{ teacher.user?.fullName || teacher.fullName }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="salaryForm.get('teacherId')?.hasError('required')">
                المعلم مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-3 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>الشهر</mat-label>
              <mat-select formControlName="month" [disabled]="data.mode === 'view'">
                <mat-option value="1">يناير</mat-option>
                <mat-option value="2">فبراير</mat-option>
                <mat-option value="3">مارس</mat-option>
                <mat-option value="4">أبريل</mat-option>
                <mat-option value="5">مايو</mat-option>
                <mat-option value="6">يونيو</mat-option>
                <mat-option value="7">يوليو</mat-option>
                <mat-option value="8">أغسطس</mat-option>
                <mat-option value="9">سبتمبر</mat-option>
                <mat-option value="10">أكتوبر</mat-option>
                <mat-option value="11">نوفمبر</mat-option>
                <mat-option value="12">ديسمبر</mat-option>
              </mat-select>
              <mat-error *ngIf="salaryForm.get('month')?.hasError('required')">
                الشهر مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-3 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>السنة</mat-label>
              <input matInput type="number" formControlName="year" 
                     [readonly]="data.mode === 'view'" min="2020" max="2030">
              <mat-error *ngIf="salaryForm.get('year')?.hasError('required')">
                السنة مطلوبة
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>الراتب الأساسي</mat-label>
              <input matInput type="number" formControlName="baseSalary" 
                     [readonly]="data.mode === 'view'" min="0" (input)="calculateTotal()">
              <mat-error *ngIf="salaryForm.get('baseSalary')?.hasError('required')">
                الراتب الأساسي مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>ساعات العمل</mat-label>
              <input matInput type="number" formControlName="hoursWorked" 
                     [readonly]="data.mode === 'view'" min="0">
              <mat-error *ngIf="salaryForm.get('hoursWorked')?.hasError('required')">
                ساعات العمل مطلوبة
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>المكافآت</mat-label>
              <input matInput type="number" formControlName="bonus" 
                     [readonly]="data.mode === 'view'" min="0" (input)="calculateTotal()">
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>الخصومات</mat-label>
              <input matInput type="number" formControlName="deductions" 
                     [readonly]="data.mode === 'view'" min="0" (input)="calculateTotal()">
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>إجمالي الراتب</mat-label>
              <input matInput type="number" formControlName="totalSalary" 
                     [readonly]="true" class="total-salary">
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>حالة الدفع</mat-label>
              <mat-select formControlName="status" [disabled]="data.mode === 'view'">
                <mat-option value="1">قيد الانتظار</mat-option>
                <mat-option value="2">مدفوع</mat-option>
                <mat-option value="3">ملغي</mat-option>
              </mat-select>
              <mat-error *ngIf="salaryForm.get('status')?.hasError('required')">
                حالة الدفع مطلوبة
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3" *ngIf="salaryForm.get('status')?.value === '2'">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>تاريخ الدفع</mat-label>
              <input matInput [matDatepicker]="paidPicker" formControlName="paidDate" 
                     [readonly]="data.mode === 'view'">
              <mat-datepicker-toggle matSuffix [for]="paidPicker"></mat-datepicker-toggle>
              <mat-datepicker #paidPicker></mat-datepicker>
            </mat-form-field>
          </div>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">
        {{ data.mode === 'view' ? 'إغلاق' : 'إلغاء' }}
      </button>
      <button mat-raised-button color="primary" 
              (click)="onSave()" 
              [disabled]="salaryForm.invalid || loading"
              *ngIf="data.mode !== 'view'">
        <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
        <i class="fas fa-save me-2" *ngIf="!loading"></i>
        {{ loading ? 'جاري الحفظ...' : 'حفظ' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .mat-dialog-content {
      min-width: 600px;
      max-height: 70vh;
      overflow-y: auto;
    }

    .total-salary {
      font-weight: bold;
      background-color: #e8f5e8 !important;
    }

    @media (max-width: 768px) {
      .mat-dialog-content {
        min-width: 300px;
      }
    }
  `]
})
export class SalaryDialogComponent implements OnInit {
  salaryForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SalaryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SalaryDialogData
  ) {
    this.salaryForm = this.fb.group({
      teacherId: ['', Validators.required],
      month: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
      year: [new Date().getFullYear(), Validators.required],
      baseSalary: ['', [Validators.required, Validators.min(0)]],
      hoursWorked: ['', [Validators.required, Validators.min(0)]],
      bonus: [0, [Validators.min(0)]],
      deductions: [0, [Validators.min(0)]],
      totalSalary: [0],
      status: ['', Validators.required],
      paidDate: [null]
    });
    
    // Watch for changes to calculate total
    this.salaryForm.get('baseSalary')?.valueChanges.subscribe(() => this.calculateTotal());
    this.salaryForm.get('bonus')?.valueChanges.subscribe(() => this.calculateTotal());
    this.salaryForm.get('deductions')?.valueChanges.subscribe(() => this.calculateTotal());
  }

  ngOnInit(): void {
    if (this.data.salary && this.data.mode !== 'add') {
      this.salaryForm.patchValue({
        teacherId: this.data.salary.teacherId,
        month: this.data.salary.month,
        year: this.data.salary.year,
        baseSalary: this.data.salary.baseSalary,
        hoursWorked: this.data.salary.hoursWorked,
        bonus: this.data.salary.bonus,
        deductions: this.data.salary.deductions,
        totalSalary: this.data.salary.totalSalary,
        status: this.data.salary.status.toString(),
        paidDate: this.data.salary.paidDate ? new Date(this.data.salary.paidDate) : null
      });
    }
    
    this.calculateTotal();
  }

  getTitle(): string {
    switch (this.data.mode) {
      case 'add': return 'إضافة راتب جديد';
      case 'edit': return 'تعديل بيانات الراتب';
      case 'view': return 'عرض تفاصيل الراتب';
      default: return 'إدارة الراتب';
    }
  }

  calculateTotal(): void {
    const baseSalary = this.salaryForm.get('baseSalary')?.value || 0;
    const bonus = this.salaryForm.get('bonus')?.value || 0;
    const deductions = this.salaryForm.get('deductions')?.value || 0;
    
    const total = parseFloat(baseSalary) + parseFloat(bonus) - parseFloat(deductions);
    this.salaryForm.patchValue({ totalSalary: total }, { emitEvent: false });
  }

  onSave(): void {
    if (this.salaryForm.valid) {
      this.loading = true;
      const formData = {
        ...this.salaryForm.value,
        month: parseInt(this.salaryForm.value.month),
        status: parseInt(this.salaryForm.value.status)
      };
      
      setTimeout(() => {
        this.loading = false;
        this.dialogRef.close(formData);
      }, 1000);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}