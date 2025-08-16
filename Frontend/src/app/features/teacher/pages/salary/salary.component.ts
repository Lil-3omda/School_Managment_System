import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../../../shared/components/layout/layout.component';

@Component({
  selector: 'app-teacher-salary',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">الراتب</h1>
      </div>
      <div class="alert alert-info">
        <i class="fas fa-info-circle me-2"></i>
        صفحة الراتب قيد التطوير
      </div>
    </app-layout>
  `
})
export class TeacherSalaryComponent {}