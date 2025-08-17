import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface GradeDialogData {
  grade?: any;
  students: any[];
  exams: any[];
  mode: 'add' | 'edit' | 'view';
}

@Component({
  selector: 'app-grade-dialog',
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
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>
      <i class="fas fa-chart-line me-2"></i>
      {{ getTitle() }}
    </h2>

    <mat-dialog-content>
      <form [formGroup]="gradeForm">
        <div class="row">
          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>الطالب</mat-label>
              <mat-select formControlName="studentId" [disabled]="data.mode === 'view'">
                <mat-option *ngFor="let student of data.students" [value]="student.id">
                  {{ student.user?.fullName || student.fullName }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="gradeForm.get('studentId')?.hasError('required')">
                الطالب مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>الامتحان</mat-label>
              <mat-select formControlName="examId" [disabled]="data.mode === 'view'">
                <mat-option *ngFor="let exam of data.exams" [value]="exam.id">
                  {{ exam.name }} - {{ exam.subjectName }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="gradeForm.get('examId')?.hasError('required')">
                الامتحان مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>الدرجة المحصلة</mat-label>
              <input matInput type="number" formControlName="marksObtained" 
                     [readonly]="data.mode === 'view'" min="0" max="100">
              <mat-error *ngIf="gradeForm.get('marksObtained')?.hasError('required')">
                الدرجة المحصلة مطلوبة
              </mat-error>
              <mat-error *ngIf="gradeForm.get('marksObtained')?.hasError('min')">
                الدرجة يجب أن تكون أكبر من أو تساوي 0
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>التقدير</mat-label>
              <mat-select formControlName="gradeValue" [disabled]="data.mode === 'view'">
                <mat-option value="A+">ممتاز (A+)</mat-option>
                <mat-option value="A">جيد جداً (A)</mat-option>
                <mat-option value="B+">جيد (B+)</mat-option>
                <mat-option value="B">مقبول (B)</mat-option>
                <mat-option value="C">ضعيف (C)</mat-option>
                <mat-option value="F">راسب (F)</mat-option>
              </mat-select>
              <mat-error *ngIf="gradeForm.get('gradeValue')?.hasError('required')">
                التقدير مطلوب
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

          <div class="col-12 mb-3">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" 
                     formControlName="isPassed" [disabled]="data.mode === 'view'">
              <label class="form-check-label">
                الطالب ناجح
              </label>
            </div>
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
              [disabled]="gradeForm.invalid || loading"
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

    .form-check {
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #dee2e6;
    }

    .form-check-input:checked {
      background-color: #28a745;
      border-color: #28a745;
    }

    @media (max-width: 768px) {
      .mat-dialog-content {
        min-width: 300px;
      }
    }
  `]
})
export class GradeDialogComponent implements OnInit {
  gradeForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<GradeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GradeDialogData
  ) {
    this.gradeForm = this.fb.group({
      studentId: ['', Validators.required],
      examId: ['', Validators.required],
      marksObtained: ['', [Validators.required, Validators.min(0)]],
      gradeValue: ['', Validators.required],
      isPassed: [false],
      remarks: ['']
    });
  }

  ngOnInit(): void {
    if (this.data.grade && this.data.mode !== 'add') {
      this.gradeForm.patchValue({
        studentId: this.data.grade.studentId,
        examId: this.data.grade.examId,
        marksObtained: this.data.grade.marksObtained,
        gradeValue: this.data.grade.gradeValue,
        isPassed: this.data.grade.isPassed,
        remarks: this.data.grade.remarks
      });
    }
  }

  getTitle(): string {
    switch (this.data.mode) {
      case 'add': return 'إضافة درجة جديدة';
      case 'edit': return 'تعديل الدرجة';
      case 'view': return 'عرض تفاصيل الدرجة';
      default: return 'إدارة الدرجة';
    }
  }

  onSave(): void {
    if (this.gradeForm.valid) {
      this.loading = true;
      const formData = this.gradeForm.value;
      
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