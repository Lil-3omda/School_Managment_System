import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LayoutComponent } from '../../../../shared/components/layout/layout.component';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';

interface Teacher {
  id: number;
  userId: number;
  employeeNumber: string;
  department: string;
  specialization: string;
  hireDate: Date;
  qualification: string;
  experience: number;
  salary: number;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-teacher-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LayoutComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class TeacherProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: User | null = null;
  teacherData: Teacher | null = null;
  loading = false;
  editing = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      department: ['', Validators.required],
      specialization: ['', Validators.required],
      qualification: ['', Validators.required],
      experience: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadTeacherData();
      }
    });
  }

  private loadTeacherData(): void {
    if (!this.currentUser) return;

    this.loading = true;
    // Mock data - replace with actual API call
    setTimeout(() => {
      this.teacherData = {
        id: 1,
        userId: this.currentUser!.id,
        employeeNumber: 'T001',
        department: 'الرياضيات',
        specialization: 'الجبر والهندسة',
        hireDate: new Date('2020-09-01'),
        qualification: 'ماجستير في الرياضيات',
        experience: 5,
        salary: 8000,
        user: this.currentUser!,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.populateForm();
      this.loading = false;
    }, 1000);
  }

  private populateForm(): void {
    if (!this.currentUser || !this.teacherData) return;

    this.profileForm.patchValue({
      firstName: this.currentUser.firstName,
      lastName: this.currentUser.lastName,
      email: this.currentUser.email,
      phoneNumber: this.currentUser.phoneNumber,
      dateOfBirth: this.currentUser.dateOfBirth,
      gender: this.currentUser.gender,
      address: this.currentUser.address,
      department: this.teacherData.department,
      specialization: this.teacherData.specialization,
      qualification: this.teacherData.qualification,
      experience: this.teacherData.experience
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
    if (this.profileForm.valid && this.editing && this.teacherData) {
      this.loading = true;
      
      const updatedData = {
        ...this.profileForm.value,
        id: this.teacherData.id
      };
      
      // Mock update - replace with actual API call
      setTimeout(() => {
        this.loading = false;
        this.editing = false;
        this.profileForm.disable();
        
        // Update current user data if needed
        if (this.currentUser) {
          this.currentUser.firstName = updatedData.firstName;
          this.currentUser.lastName = updatedData.lastName;
          this.currentUser.email = updatedData.email;
          this.currentUser.phoneNumber = updatedData.phoneNumber;
          this.currentUser.address = updatedData.address;
        }
        
        // Update teacher data
        if (this.teacherData) {
          this.teacherData.department = updatedData.department;
          this.teacherData.specialization = updatedData.specialization;
          this.teacherData.qualification = updatedData.qualification;
          this.teacherData.experience = updatedData.experience;
        }
        
        alert('تم حفظ البيانات بنجاح');
      }, 1000);
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