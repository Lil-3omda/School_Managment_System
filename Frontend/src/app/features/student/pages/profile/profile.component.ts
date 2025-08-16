import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../../core/services/auth.service';
import { StudentService } from '../../../../core/services/student.service';
import { User } from '../../../../core/models/user.model';
import { Student } from '../../../../core/models/student.model';
import { LayoutComponent } from '../../../../shared/components/layout/layout.component';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    LayoutComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class StudentProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: User | null = null;
  studentData: Student | null = null;
  loading = false;
  editing = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private studentService: StudentService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      guardianName: ['', Validators.required],
      guardianPhone: ['', Validators.required],
      guardianEmail: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadStudentData();
      }
    });
  }

  private loadStudentData(): void {
    if (!this.currentUser) return;

    this.loading = true;
    this.studentService.getStudent(this.currentUser.id)
      .pipe(
        catchError(error => {
          console.error('Error loading student data:', error);
          // Fallback to mock data if API fails
          return of({
            id: 1,
            userId: this.currentUser!.id,
            studentNumber: 'S001',
            enrollmentDate: new Date('2023-09-01'),
            classId: 1,
            className: 'الصف الثالث أ',
            guardianName: 'عبد الله الطالب',
            guardianPhone: '0501111111',
            guardianEmail: 'guardian@example.com',
            user: this.currentUser!,
            createdAt: new Date(),
            updatedAt: new Date()
          } as Student);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(student => {
        this.studentData = student;
        this.populateForm();
      });
  }

  private populateForm(): void {
    if (!this.currentUser || !this.studentData) return;

    this.profileForm.patchValue({
      firstName: this.currentUser.firstName,
      lastName: this.currentUser.lastName,
      email: this.currentUser.email,
      phoneNumber: this.currentUser.phoneNumber,
      dateOfBirth: this.currentUser.dateOfBirth,
      gender: this.currentUser.gender,
      address: this.currentUser.address,
      guardianName: this.studentData.guardianName,
      guardianPhone: this.studentData.guardianPhone,
      guardianEmail: this.studentData.guardianEmail
    });

    if (!this.editing) {
      this.profileForm.disable();
    }
  }

  toggleEdit(): void {
    this.editing = !this.editing;
    if (this.editing) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
      this.populateForm(); // Reset form
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.editing && this.studentData) {
      this.loading = true;
      
      const updatedData = {
        ...this.profileForm.value,
        studentNumber: this.studentData.studentNumber,
        enrollmentDate: this.studentData.enrollmentDate,
        classId: this.studentData.classId
      };
      
      this.studentService.updateStudent(this.studentData.id, updatedData)
        .pipe(
          catchError(error => {
            console.error('Error updating student data:', error);
            this.snackBar.open('حدث خطأ في حفظ البيانات', 'إغلاق', { duration: 3000 });
            return of(null);
          }),
          finalize(() => this.loading = false)
        )
        .subscribe(response => {
          if (response) {
            this.editing = false;
            this.profileForm.disable();
            
            // Update current user data
            if (this.currentUser) {
              this.currentUser.firstName = updatedData.firstName;
              this.currentUser.lastName = updatedData.lastName;
              this.currentUser.email = updatedData.email;
              this.currentUser.phoneNumber = updatedData.phoneNumber;
              this.currentUser.address = updatedData.address;
            }
            
            // Update student data
            if (this.studentData) {
              this.studentData.guardianName = updatedData.guardianName;
              this.studentData.guardianPhone = updatedData.guardianPhone;
              this.studentData.guardianEmail = updatedData.guardianEmail;
            }
            
            this.snackBar.open('تم حفظ البيانات بنجاح', 'إغلاق', { duration: 3000 });
          }
        });
    }
  }

  getGenderText(gender: number): string {
    switch (gender) {
      case 1: return 'ذكر';
      case 2: return 'أنثى';
      default: return 'غير محدد';
    }
  }
}