using Microsoft.EntityFrameworkCore;
using SchoolManagement.Domain.Entities;
using SchoolManagement.Domain.Enums;
using BCrypt.Net;

namespace SchoolManagement.Infrastructure.Data;

public static class SeedData
{
    public static async Task Initialize(SchoolDbContext context)
    {
        // Ensure database is created
        await context.Database.EnsureCreatedAsync();

        // Check if data already exists
        if (await context.Users.AnyAsync())
        {
            return; // Database has been seeded
        }

        // Create Classes
        var classes = new List<Class>
        {
            new Class
            {
                Name = "الصف الأول أ",
                Description = "الصف الأول الابتدائي - شعبة أ",
                Capacity = 30,
                Room = "قاعة 101",
                StartTime = new TimeSpan(8, 0, 0),
                EndTime = new TimeSpan(14, 0, 0),
                CreatedAt = DateTime.UtcNow
            },
            new Class
            {
                Name = "الصف الثاني ب",
                Description = "الصف الثاني الابتدائي - شعبة ب",
                Capacity = 25,
                Room = "قاعة 102",
                StartTime = new TimeSpan(8, 0, 0),
                EndTime = new TimeSpan(14, 0, 0),
                CreatedAt = DateTime.UtcNow
            },
            new Class
            {
                Name = "الصف الثالث أ",
                Description = "الصف الثالث الابتدائي - شعبة أ",
                Capacity = 28,
                Room = "قاعة 201",
                StartTime = new TimeSpan(8, 0, 0),
                EndTime = new TimeSpan(14, 0, 0),
                CreatedAt = DateTime.UtcNow
            }
        };

        await context.Classes.AddRangeAsync(classes);
        await context.SaveChangesAsync();

        // Create Subjects
        var subjects = new List<Subject>
        {
            new Subject
            {
                Name = "الرياضيات",
                Code = "MATH101",
                Description = "مادة الرياضيات للمرحلة الابتدائية",
                Credits = 3,
                CreatedAt = DateTime.UtcNow
            },
            new Subject
            {
                Name = "اللغة العربية",
                Code = "ARAB101",
                Description = "مادة اللغة العربية",
                Credits = 4,
                CreatedAt = DateTime.UtcNow
            },
            new Subject
            {
                Name = "العلوم",
                Code = "SCI101",
                Description = "مادة العلوم العامة",
                Credits = 3,
                CreatedAt = DateTime.UtcNow
            },
            new Subject
            {
                Name = "التاريخ",
                Code = "HIST101",
                Description = "مادة التاريخ",
                Credits = 2,
                CreatedAt = DateTime.UtcNow
            }
        };

        await context.Subjects.AddRangeAsync(subjects);
        await context.SaveChangesAsync();

        // Create Users
        var adminUser = new User
        {
            FirstName = "أحمد",
            LastName = "المدير",
            Email = "admin@school.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
            PhoneNumber = "0501234567",
            DateOfBirth = new DateTime(1980, 1, 1),
            Gender = Gender.Male,
            Address = "الرياض، المملكة العربية السعودية",
            Role = UserRole.Admin,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var teacherUser = new User
        {
            FirstName = "فاطمة",
            LastName = "المعلمة",
            Email = "teacher@school.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
            PhoneNumber = "0507654321",
            DateOfBirth = new DateTime(1985, 5, 15),
            Gender = Gender.Female,
            Address = "جدة، المملكة العربية السعودية",
            Role = UserRole.Teacher,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var studentUser = new User
        {
            FirstName = "محمد",
            LastName = "الطالب",
            Email = "student@school.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
            PhoneNumber = "0509876543",
            DateOfBirth = new DateTime(2010, 3, 20),
            Gender = Gender.Male,
            Address = "الدمام، المملكة العربية السعودية",
            Role = UserRole.Student,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await context.Users.AddRangeAsync(adminUser, teacherUser, studentUser);
        await context.SaveChangesAsync();

        // Create Teacher
        var teacher = new Teacher
        {
            UserId = teacherUser.Id,
            EmployeeNumber = "T001",
            HireDate = new DateTime(2020, 9, 1),
            Qualification = "بكالوريوس في التربية",
            Specialization = "الرياضيات",
            BaseSalary = 8000,
            SalaryType = SalaryType.Fixed,
            HourlyRate = 0,
            CreatedAt = DateTime.UtcNow
        };

        await context.Teachers.AddAsync(teacher);
        await context.SaveChangesAsync();

        // Create Student
        var student = new Student
        {
            UserId = studentUser.Id,
            StudentNumber = "S001",
            EnrollmentDate = new DateTime(2023, 9, 1),
            ClassId = classes[0].Id,
            GuardianName = "عبد الله الطالب",
            GuardianPhone = "0501111111",
            GuardianEmail = "guardian@example.com",
            CreatedAt = DateTime.UtcNow
        };

        await context.Students.AddAsync(student);
        await context.SaveChangesAsync();

        // Create Class-Subject relationships through ClassTeacher
        var class1 = classes[0];
        var class2 = classes[1];
        var class3 = classes[2];

        // Create ClassTeacher relationships
        var classTeacher1 = new ClassTeacher
        {
            ClassId = class1.Id,
            TeacherId = teacher.Id,
            SubjectId = subjects[0].Id, // Math
            IsPrimary = true
        };

        var classTeacher2 = new ClassTeacher
        {
            ClassId = class1.Id,
            TeacherId = teacher.Id,
            SubjectId = subjects[1].Id, // Arabic
            IsPrimary = false
        };

        var classTeacher3 = new ClassTeacher
        {
            ClassId = class1.Id,
            TeacherId = teacher.Id,
            SubjectId = subjects[2].Id, // Science
            IsPrimary = false
        };

        var classTeacher4 = new ClassTeacher
        {
            ClassId = class2.Id,
            TeacherId = teacher.Id,
            SubjectId = subjects[0].Id, // Math
            IsPrimary = true
        };

        var classTeacher5 = new ClassTeacher
        {
            ClassId = class2.Id,
            TeacherId = teacher.Id,
            SubjectId = subjects[1].Id, // Arabic
            IsPrimary = false
        };

        var classTeacher6 = new ClassTeacher
        {
            ClassId = class2.Id,
            TeacherId = teacher.Id,
            SubjectId = subjects[3].Id, // History
            IsPrimary = false
        };

        var classTeacher7 = new ClassTeacher
        {
            ClassId = class3.Id,
            TeacherId = teacher.Id,
            SubjectId = subjects[0].Id, // Math
            IsPrimary = true
        };

        var classTeacher8 = new ClassTeacher
        {
            ClassId = class3.Id,
            TeacherId = teacher.Id,
            SubjectId = subjects[1].Id, // Arabic
            IsPrimary = false
        };

        var classTeacher9 = new ClassTeacher
        {
            ClassId = class3.Id,
            TeacherId = teacher.Id,
            SubjectId = subjects[2].Id, // Science
            IsPrimary = false
        };

        var classTeacher10 = new ClassTeacher
        {
            ClassId = class3.Id,
            TeacherId = teacher.Id,
            SubjectId = subjects[3].Id, // History
            IsPrimary = false
        };

        await context.ClassTeachers.AddRangeAsync(
            classTeacher1, classTeacher2, classTeacher3, classTeacher4, classTeacher5,
            classTeacher6, classTeacher7, classTeacher8, classTeacher9, classTeacher10
        );
        await context.SaveChangesAsync();

        // Note: Class-Teacher assignments are now handled above through the ClassTeacher entity

        // Create sample exam
        var exam = new Exam
        {
            Name = "امتحان الرياضيات الشهري",
            Description = "امتحان شهري في مادة الرياضيات",
            ExamDate = DateTime.UtcNow.AddDays(7),
            Duration = new TimeSpan(2, 0, 0),
            TotalMarks = 100,
            PassingMarks = 50,
            Type = ExamType.MidTerm,
            ClassId = classes[0].Id,
            SubjectId = subjects[0].Id,
            CreatedAt = DateTime.UtcNow
        };

        await context.Exams.AddAsync(exam);
        await context.SaveChangesAsync();

        // Create sample grade
        var grade = new Grade
        {
            StudentId = student.Id,
            ExamId = exam.Id,
            MarksObtained = 85,
            GradeValue = "A",
            IsPassed = true,
            Remarks = "أداء ممتاز",
            CreatedAt = DateTime.UtcNow
        };

        await context.Grades.AddAsync(grade);
        await context.SaveChangesAsync();

        // Create sample attendance
        var attendance = new Attendance
        {
            Date = DateTime.Today,
            ClassId = classes[0].Id,
            StudentId = student.Id,
            Status = AttendanceStatus.Present,
            Remarks = "حضور منتظم",
            CreatedAt = DateTime.UtcNow
        };

        await context.Attendances.AddAsync(attendance);
        await context.SaveChangesAsync();

        // Create sample salary
        var salary = new Salary
        {
            TeacherId = teacher.Id,
            Month = DateTime.Now.Month,
            Year = DateTime.Now.Year,
            BaseSalary = 8000,
            HoursWorked = 160,
            Bonus = 500,
            Deductions = 200,
            TotalSalary = 8300,
            Status = SalaryStatus.Paid,
            PaidDate = DateTime.UtcNow.AddDays(-5),
            CreatedAt = DateTime.UtcNow
        };

        await context.Salaries.AddAsync(salary);
        await context.SaveChangesAsync();
    }
}