import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-manage-exams',
  standalone: true,
  imports: [CommonModule, MatCardModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container-fluid">
      <mat-card>
        <mat-card-header>
          <mat-card-title>إدارة الامتحانات</mat-card-title>
          <mat-card-subtitle>عرض وإدارة الامتحانات والدرجات</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>هذه الصفحة قيد التطوير...</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container-fluid {
      padding: 2rem;
    }
    mat-card {
      margin-top: 1rem;
    }
  `]
})
export class ManageExamsComponent {
}