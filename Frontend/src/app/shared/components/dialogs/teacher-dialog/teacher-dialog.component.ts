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

export interface TeacherDialogData {
  teacher?: any;
  mode: 'add' | 'edit' | 'view';
}

@Component({
  selector: 'app-teacher-dialog',
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
      <i class="fas fa-chalkboard-teacher me-2"></i>
      {{ getTitle() }}
    </h2>

    <mat-dialog-content>
      <form [formGroup]="teacherForm">
        <div class="row">
          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>الاسم الأول</mat-label>
              <input matInput formControlName="firstName" [readonly]="data.mode === 'view'">
              <mat-error *ngIf="teacherForm.get('firstName')?.hasError('required')">
                الاسم الأول مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>الاسم الأخير</mat-label>
              <input matInput formControlName="lastName" [readonly]="data.mode === 'view'">
              <mat-error *ngIf="teacherForm.get('lastName')?.hasError('required')">
                الاسم الأخير مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>البريد الإلكتروني</mat-label>
              <input matInput type="email" formControlName="email" [readonly]="data.mode === 'view'">
              <mat-error *ngIf="teacherForm.get('email')?.hasError('required')">
                البريد الإلكتروني مطلوب
              </mat-error>
              <mat-error *ngIf="teacherForm.get('email')?.hasError('email')">
                البريد الإلكتروني غير صحيح
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>رقم الهاتف</mat-label>
              <input matInput formControlName="phoneNumber" [readonly]="data.mode === 'view'">
              <mat-error *ngIf="teacherForm.get('phoneNumber')?.hasError('required')">
                رقم الهاتف مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>رقم الموظف</mat-label>
              <input matInput formControlName="employeeNumber" [readonly]="data.mode === 'view'">
              <mat-error *ngIf="teacherForm.get('employeeNumber')?.hasError('required')">
                رقم الموظف مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>تاريخ التوظيف</mat-label>
              <input matInput [matDatepicker]="hirePicker" formControlName="hireDate" 
                     [readonly]="data.mode === 'view'">
              <mat-datepicker-toggle matSuffix [for]="hirePicker"></mat-datepicker-toggle>
              <mat-datepicker #hirePicker></mat-datepicker>
              <mat-error *ngIf="teacherForm.get('hireDate')?.hasError('required')">
                تاريخ التوظيف مطلوب
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
              <mat-error *ngIf="teacherForm.get('dateOfBirth')?.hasError('required')">
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
              <mat-error *ngIf="teacherForm.get('gender')?.hasError('required')">
                الجنس مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>المؤهل العلمي</mat-label>
              <input matInput formControlName="qualification" [readonly]="data.mode === 'view'">
              <mat-error *ngIf="teacherForm.get('qualification')?.hasError('required')">
                المؤهل العلمي مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>التخصص</mat-label>
              <input matInput formControlName="specialization" [readonly]="data.mode === 'view'">
              <mat-error *ngIf="teacherForm.get('specialization')?.hasError('required')">
                التخصص مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>الراتب الأساسي</mat-label>
              <input matInput type="number" formControlName="baseSalary" 
                     [readonly]="data.mode === 'view'" min="0">
              <mat-error *ngIf="teacherForm.get('baseSalary')?.hasError('required')">
                الراتب الأساسي مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>نوع الراتب</mat-label>
              <mat-select formControlName="salaryType" [disabled]="data.mode === 'view'">
                <mat-option value="1">ثابت</mat-option>
                <mat-option value="2">بالساعة</mat-option>
              </mat-select>
              <mat-error *ngIf="teacherForm.get('salaryType')?.hasError('required')">
                نوع الراتب مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3" *ngIf="teacherForm.get('salaryType')?.value === '2'">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>الأجر بالساعة</mat-label>
              <input matInput type="number" formControlName="hourlyRate" 
                     [readonly]="data.mode === 'view'" min="0">
            </mat-form-field>
          </div>

          <div class="col-12 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>العنوان</mat-label>
              <textarea matInput formControlName="address" rows="2" 
                        [readonly]="data.mode === 'view'"></textarea>
              <mat-error *ngIf="teacherForm.get('address')?.hasError('required')">
                العنوان مطلوب
              </mat-error>
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
              [disabled]="teacherForm.invalid || loading"
              *ngIf="data.mode !== 'view'">
        <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
        <i class="fas fa-save me-2" *ngIf="!loading"></i>
        {{ loading ? 'جاري الحفظ...' : 'حفظ' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .mat-dialog-content {
      min-width: 700px;
      max-height: 70vh;
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .mat-dialog-content {
        min-width: 300px;
      }
    }
  `]
})
export class TeacherDialogComponent implements OnInit {
  teacherForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TeacherDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TeacherDialogData
  ) {
    this.teacherForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      employeeNumber: ['', Validators.required],
      hireDate: ['', Validators.required],
      qualification: ['', Validators.required],
      specialization: ['', Validators.required],
      baseSalary: ['', [Validators.required, Validators.min(0)]],
      salaryType: ['', Validators.required],
      hourlyRate: [0, [Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    if (this.data.teacher && this.data.mode !== 'add') {
      this.teacherForm.patchValue({
        firstName: this.data.teacher.user?.firstName,
        lastName: this.data.teacher.user?.lastName,
        email: this.data.teacher.user?.email,
        phoneNumber: this.data.teacher.user?.phoneNumber,
        dateOfBirth: new Date(this.data.teacher.user?.dateOfBirth),
        gender: this.data.teacher.user?.gender.toString(),
        address: this.data.teacher.user?.address,
        employeeNumber: this.data.teacher.employeeNumber,
        hireDate: new Date(this.data.teacher.hireDate),
        qualification: this.data.teacher.qualification,
        specialization: this.data.teacher.specialization,
        baseSalary: this.data.teacher.baseSalary,
        salaryType: this.data.teacher.salaryType.toString(),
        hourlyRate: this.data.teacher.hourlyRate
      });
    }
  }

  getTitle(): string {
    switch (this.data.mode) {
      case 'add': return 'إضافة معلم جديد';
      case 'edit': return 'تعديل بيانات المعلم';
      case 'view': return 'عرض تفاصيل المعلم';
      default: return 'إدارة المعلم';
    }
  }

  onSave(): void {
    if (this.teacherForm.valid) {
      this.loading = true;
      const formData = {
        firstName: this.teacherForm.value.firstName,
        lastName: this.teacherForm.value.lastName,
        email: this.teacherForm.value.email,
        phoneNumber: this.teacherForm.value.phoneNumber,
        dateOfBirth: this.teacherForm.value.dateOfBirth,
        gender: parseInt(this.teacherForm.value.gender),
        address: this.teacherForm.value.address,
        employeeNumber: this.teacherForm.value.employeeNumber,
        hireDate: this.teacherForm.value.hireDate,
        qualification: this.teacherForm.value.qualification,
        specialization: this.teacherForm.value.specialization,
        baseSalary: parseFloat(this.teacherForm.value.baseSalary),
        salaryType: parseInt(this.teacherForm.value.salaryType),
        hourlyRate: parseFloat(this.teacherForm.value.hourlyRate || 0)
      };
      
      // Return the form data immediately instead of using setTimeout
      this.loading = false;
      this.dialogRef.close(formData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}