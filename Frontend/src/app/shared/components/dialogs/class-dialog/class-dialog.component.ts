import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface ClassDialogData {
  class?: any;
  mode: 'add' | 'edit' | 'view';
}

@Component({
  selector: 'app-class-dialog',
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
      <i class="fas fa-school me-2"></i>
      {{ getTitle() }}
    </h2>

    <mat-dialog-content>
      <form [formGroup]="classForm">
        <div class="row">
          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>اسم الصف</mat-label>
              <input matInput formControlName="name" [readonly]="data.mode === 'view'">
              <mat-error *ngIf="classForm.get('name')?.hasError('required')">
                اسم الصف مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>السعة</mat-label>
              <input matInput type="number" formControlName="capacity" 
                     [readonly]="data.mode === 'view'" min="1" max="50">
              <mat-error *ngIf="classForm.get('capacity')?.hasError('required')">
                السعة مطلوبة
              </mat-error>
              <mat-error *ngIf="classForm.get('capacity')?.hasError('min')">
                السعة يجب أن تكون أكبر من 0
              </mat-error>
              <mat-error *ngIf="classForm.get('capacity')?.hasError('max')">
                السعة يجب أن تكون أقل من أو تساوي 50
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>القاعة</mat-label>
              <input matInput formControlName="room" [readonly]="data.mode === 'view'">
              <mat-error *ngIf="classForm.get('room')?.hasError('required')">
                القاعة مطلوبة
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>وقت البداية</mat-label>
              <input matInput type="time" formControlName="startTime" 
                     [readonly]="data.mode === 'view'">
              <mat-error *ngIf="classForm.get('startTime')?.hasError('required')">
                وقت البداية مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>وقت النهاية</mat-label>
              <input matInput type="time" formControlName="endTime" 
                     [readonly]="data.mode === 'view'">
              <mat-error *ngIf="classForm.get('endTime')?.hasError('required')">
                وقت النهاية مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-12 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>وصف الصف</mat-label>
              <textarea matInput formControlName="description" rows="3" 
                        [readonly]="data.mode === 'view'"></textarea>
              <mat-error *ngIf="classForm.get('description')?.hasError('required')">
                وصف الصف مطلوب
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
              [disabled]="classForm.invalid || loading"
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
export class ClassDialogComponent implements OnInit {
  classForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ClassDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClassDialogData
  ) {
    this.classForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1), Validators.max(50)]],
      room: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data.class && this.data.mode !== 'add') {
      this.classForm.patchValue({
        name: this.data.class.name,
        description: this.data.class.description,
        capacity: this.data.class.capacity,
        room: this.data.class.room,
        startTime: this.data.class.startTime,
        endTime: this.data.class.endTime
      });
    }
  }

  getTitle(): string {
    switch (this.data.mode) {
      case 'add': return 'إضافة صف جديد';
      case 'edit': return 'تعديل بيانات الصف';
      case 'view': return 'عرض تفاصيل الصف';
      default: return 'إدارة الصف';
    }
  }

  onSave(): void {
    if (this.classForm.valid) {
      this.loading = true;
      const formData = {
        name: this.classForm.value.name,
        description: this.classForm.value.description,
        capacity: parseInt(this.classForm.value.capacity),
        room: this.classForm.value.room,
        startTime: this.classForm.value.startTime,
        endTime: this.classForm.value.endTime
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