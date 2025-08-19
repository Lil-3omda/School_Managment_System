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

export interface ExamDialogData {
  exam?: any;
  classes: any[];
  subjects: any[];
  mode: 'add' | 'edit' | 'view';
}

@Component({
  selector: 'app-exam-dialog',
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
      <i class="fas fa-clipboard-list me-2"></i>
      {{ getTitle() }}
    </h2>

    <mat-dialog-content>
      <form [formGroup]="examForm">
        <div class="row">
          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>اسم الامتحان</mat-label>
              <input matInput formControlName="name" [readonly]="data.mode === 'view'">
              <mat-error *ngIf="examForm.get('name')?.hasError('required')">
                اسم الامتحان مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>نوع الامتحان</mat-label>
              <mat-select formControlName="type" [disabled]="data.mode === 'view'">
                <mat-option value="1">اختبار قصير</mat-option>
                <mat-option value="2">امتحان نصفي</mat-option>
                <mat-option value="3">امتحان نهائي</mat-option>
                <mat-option value="4">واجب</mat-option>
              </mat-select>
              <mat-error *ngIf="examForm.get('type')?.hasError('required')">
                نوع الامتحان مطلوب
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
              <mat-error *ngIf="examForm.get('classId')?.hasError('required')">
                الصف مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>المادة</mat-label>
              <mat-select formControlName="subjectId" [disabled]="data.mode === 'view'">
                <mat-option *ngFor="let subject of data.subjects" [value]="subject.id">
                  {{ subject.name }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="examForm.get('subjectId')?.hasError('required')">
                المادة مطلوبة
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>تاريخ الامتحان</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="examDate" 
                     [readonly]="data.mode === 'view'">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="examForm.get('examDate')?.hasError('required')">
                تاريخ الامتحان مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>مدة الامتحان (بالدقائق)</mat-label>
              <input matInput type="number" formControlName="duration" 
                     [readonly]="data.mode === 'view'" min="1">
              <mat-error *ngIf="examForm.get('duration')?.hasError('required')">
                مدة الامتحان مطلوبة
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>الدرجة الكلية</mat-label>
              <input matInput type="number" formControlName="totalMarks" 
                     [readonly]="data.mode === 'view'" min="1">
              <mat-error *ngIf="examForm.get('totalMarks')?.hasError('required')">
                الدرجة الكلية مطلوبة
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>درجة النجاح</mat-label>
              <input matInput type="number" formControlName="passingMarks" 
                     [readonly]="data.mode === 'view'" min="1">
              <mat-error *ngIf="examForm.get('passingMarks')?.hasError('required')">
                درجة النجاح مطلوبة
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-12 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>وصف الامتحان</mat-label>
              <textarea matInput formControlName="description" rows="3" 
                        [readonly]="data.mode === 'view'"></textarea>
              <mat-error *ngIf="examForm.get('description')?.hasError('required')">
                وصف الامتحان مطلوب
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
              [disabled]="examForm.invalid || loading"
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

    @media (max-width: 768px) {
      .mat-dialog-content {
        min-width: 300px;
      }
    }
  `]
})
export class ExamDialogComponent implements OnInit {
  examForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ExamDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExamDialogData
  ) {
    this.examForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      examDate: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      totalMarks: ['', [Validators.required, Validators.min(1)]],
      passingMarks: ['', [Validators.required, Validators.min(1)]],
      type: ['', Validators.required],
      classId: ['', Validators.required],
      subjectId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data.exam && this.data.mode !== 'add') {
      this.examForm.patchValue({
        name: this.data.exam.name,
        description: this.data.exam.description,
        examDate: new Date(this.data.exam.examDate),
        duration: this.data.exam.duration,
        totalMarks: this.data.exam.totalMarks,
        passingMarks: this.data.exam.passingMarks,
        type: this.data.exam.type.toString(),
        classId: this.data.exam.classId,
        subjectId: this.data.exam.subjectId
      });
    }
  }

  getTitle(): string {
    switch (this.data.mode) {
      case 'add': return 'إنشاء امتحان جديد';
      case 'edit': return 'تعديل الامتحان';
      case 'view': return 'عرض تفاصيل الامتحان';
      default: return 'إدارة الامتحان';
    }
  }

  onSave(): void {
    if (this.examForm.valid) {
      this.loading = true;
      const formData = {
        ...this.examForm.value,
        type: parseInt(this.examForm.value.type),
        duration: `${this.examForm.value.duration}:00:00` // Convert to TimeSpan format
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