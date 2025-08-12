import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-5">
      <div class="alert alert-danger text-center">
        <h4>غير مصرح لك بالوصول إلى هذه الصفحة</h4>
        <p>يرجى التواصل مع المدير للحصول على الصلاحيات المناسبة</p>
      </div>
    </div>
  `
})
export class UnauthorizedComponent {}