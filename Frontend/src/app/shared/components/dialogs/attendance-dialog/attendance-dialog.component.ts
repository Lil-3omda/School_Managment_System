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

export interface AttendanceDialogData {
  attendance?: any;
  students: any[];
  classes: any[];
  mode: 'add' | 'edit' | 'view';
}

@Component({
  selector: 'app-attendance-dialog',
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
      <i class="fas fa-calendar-check me-2"></i>
      {{ getTitle() }}
    </h2>

    <mat-dialog-content>
      <form [formGroup]="attendanceForm">
        <div class="row">
          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>التاريخ</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="date" 
                     [readonly]="data.mode === 'view'">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="attendanceForm.get('date')?.hasError('required')">
                التاريخ مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>الصف</mat-label>
              <mat-select formControlName="classId" [disabled]="data.mode === 'view'">
                <mat-option *ngFor="let class of data.classes" [value]="class.id">
                  {{ class.name }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="attendanceForm.get('classId')?.hasError('required')">
                الصف مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>الطالب</mat-label>
              <mat-select formControlName="studentId" [disabled]="data.mode === 'view'">
                <mat-option *ngFor="let student of data.students" [value]="student.id">
                  {{ student.user?.fullName || student.fullName }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="attendanceForm.get('studentId')?.hasError('required')">
                الطالب مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>حالة الحضور</mat-label>
              <mat-select formControlName="status" [disabled]="data.mode === 'view'">
                <mat-option value="1">حاضر</mat-option>
                <mat-option value="2">غائب</mat-option>
                <mat-option value="3">متأخر</mat-option>
                <mat-option value="4">معذور</mat-option>
              </mat-select>
              <mat-error *ngIf="attendanceForm.get('status')?.hasError('required')">
                حالة الحضور مطلوبة
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-12 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>ملاحظات</mat-label>
              <textarea matInput formControlName="remarks" rows="3" 
                        [readonly]="data.mode === 'view'"></textarea>
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
              [disabled]="attendanceForm.invalid || loading"
              *ngIf="data.mode !== 'view'">
        <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
        <i class="fas fa-save me-2" *ngIf="!loading"></i>
        {{ loading ? 'جاري الحفظ...' : 'حفظ' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .mat-dialog-content {
      min-width: 500px;
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
export class AttendanceDialogComponent implements OnInit {
  attendanceForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AttendanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AttendanceDialogData
  ) {
    this.attendanceForm = this.fb.group({
      date: [new Date(), Validators.required],
      classId: ['', Validators.required],
      studentId: ['', Validators.required],
      status: ['', Validators.required],
      remarks: ['']
    });
  }

  ngOnInit(): void {
    if (this.data.attendance && this.data.mode !== 'add') {
      this.attendanceForm.patchValue({
        date: new Date(this.data.attendance.date),
        classId: this.data.attendance.classId,
        studentId: this.data.attendance.studentId,
        status: this.data.attendance.status.toString(),
        remarks: this.data.attendance.remarks
      });
    }
  }

  getTitle(): string {
    switch (this.data.mode) {
      case 'add': return 'تسجيل حضور جديد';
      case 'edit': return 'تعديل سجل الحضور';
      case 'view': return 'عرض تفاصيل الحضور';
      default: return 'إدارة الحضور';
    }
  }

  onSave(): void {
    if (this.attendanceForm.valid) {
      this.loading = true;
      const formData = {
        ...this.attendanceForm.value,
        status: parseInt(this.attendanceForm.value.status)
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