import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';

interface Class {
  id: number;
  name: string;
  description: string;
  capacity: number;
  room: string;
  startTime: string;
  endTime: string;
  currentStudents: number;
  teacherName: string;
}

@Component({
  selector: 'app-manage-classes',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    NavbarComponent
  ],
  templateUrl: './manage-classes.component.html',
  styleUrls: ['./manage-classes.component.scss']
})
export class ManageClassesComponent implements OnInit {
  displayedColumns: string[] = ['name', 'room', 'time', 'capacity', 'teacher', 'actions'];
  dataSource = new MatTableDataSource<Class>();
  loading = false;

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    this.loading = true;
    // Mock data for now
    const mockClasses: Class[] = [
      {
        id: 1,
        name: 'الصف الأول أ',
        description: 'صف أول ابتدائي - شعبة أ',
        capacity: 30,
        room: 'A101',
        startTime: '08:00',
        endTime: '12:00',
        currentStudents: 25,
        teacherName: 'أحمد محمد علي'
      },
      {
        id: 2,
        name: 'الصف الثاني ب',
        description: 'صف ثاني ابتدائي - شعبة ب',
        capacity: 28,
        room: 'B201',
        startTime: '08:00',
        endTime: '12:30',
        currentStudents: 27,
        teacherName: 'فاطمة أحمد السالم'
      },
      {
        id: 3,
        name: 'الصف الثالث أ',
        description: 'صف ثالث ابتدائي - شعبة أ',
        capacity: 32,
        room: 'C301',
        startTime: '07:30',
        endTime: '13:00',
        currentStudents: 30,
        teacherName: 'محمد عبد الله'
      }
    ];

    setTimeout(() => {
      this.dataSource.data = mockClasses;
      this.loading = false;
    }, 1000);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addClass(): void {
    // TODO: Implement add class functionality
    console.log('Add class clicked');
  }

  viewClass(classItem: Class): void {
    // TODO: Implement view class functionality
    console.log('View class:', classItem);
  }

  editClass(classItem: Class): void {
    // TODO: Implement edit class functionality
    console.log('Edit class:', classItem);
  }

  deleteClass(classItem: Class): void {
    // TODO: Implement delete class functionality
    console.log('Delete class:', classItem);
  }

  getCapacityPercentage(classItem: Class): number {
    return (classItem.currentStudents / classItem.capacity) * 100;
  }

  getCapacityColor(classItem: Class): string {
    const percentage = this.getCapacityPercentage(classItem);
    if (percentage >= 90) return 'warn';
    if (percentage >= 75) return 'accent';
    return 'primary';
  }
}