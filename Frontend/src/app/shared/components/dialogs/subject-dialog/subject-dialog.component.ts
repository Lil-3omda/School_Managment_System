import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface SubjectDialogData {
  subject?: any;
  mode: 'add' | 'edit' | 'view';
}

@Component({
  selector: 'app-subject-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>
      <i class="fas fa-book me-2"></i>
      {{ getTitle() }}
    </h2>

    <mat-dialog-content>
      <form [formGroup]="subjectForm">
        <div class="row">
          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>اسم المادة</mat-label>
              <input matInput formControlName="name" [readonly]="data.mode === 'view'">
              <mat-error *ngIf="subjectForm.get('name')?.hasError('required')">
                اسم المادة مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>كود المادة</mat-label>
              <input matInput formControlName="code" [readonly]="data.mode === 'view'">
              <mat-error *ngIf="subjectForm.get('code')?.hasError('required')">
                كود المادة مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>عدد الساعات المعتمدة</mat-label>
              <input matInput type="number" formControlName="credits" 
                     [readonly]="data.mode === 'view'" min="1" max="10">
              <mat-error *ngIf="subjectForm.get('credits')?.hasError('required')">
                عدد الساعات المعتمدة مطلوب
              </mat-error>
              <mat-error *ngIf="subjectForm.get('credits')?.hasError('min')">
                عدد الساعات يجب أن يكون أكبر من 0
              </mat-error>
              <mat-error *ngIf="subjectForm.get('credits')?.hasError('max')">
                عدد الساعات يجب أن يكون أقل من أو يساوي 10
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-12 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>وصف المادة</mat-label>
              <textarea matInput formControlName="description" rows="4" 
                        [readonly]="data.mode === 'view'"></textarea>
              <mat-error *ngIf="subjectForm.get('description')?.hasError('required')">
                وصف المادة مطلوب
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
              [disabled]="subjectForm.invalid || loading"
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
export class SubjectDialogComponent implements OnInit {
  subjectForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SubjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SubjectDialogData
  ) {
    this.subjectForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      description: ['', Validators.required],
      credits: ['', [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  ngOnInit(): void {
    if (this.data.subject && this.data.mode !== 'add') {
      this.subjectForm.patchValue({
        name: this.data.subject.name,
        code: this.data.subject.code,
        description: this.data.subject.description,
        credits: this.data.subject.credits
      });
    }
  }

  getTitle(): string {
    switch (this.data.mode) {
      case 'add': return 'إضافة مادة جديدة';
      case 'edit': return 'تعديل بيانات المادة';
      case 'view': return 'عرض تفاصيل المادة';
      default: return 'إدارة المادة';
    }
  }

  onSave(): void {
    if (this.subjectForm.valid) {
      this.loading = true;
      const formData = {
        name: this.subjectForm.value.name,
        code: this.subjectForm.value.code,
        description: this.subjectForm.value.description,
        credits: parseInt(this.subjectForm.value.credits)
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