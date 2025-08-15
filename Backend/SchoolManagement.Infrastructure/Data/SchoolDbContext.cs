using Microsoft.EntityFrameworkCore;
using SchoolManagement.Domain.Entities;

namespace SchoolManagement.Infrastructure.Data;

public class SchoolDbContext : DbContext
{
    public SchoolDbContext(DbContextOptions<SchoolDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Student> Students { get; set; }
    public DbSet<Teacher> Teachers { get; set; }
    public DbSet<Class> Classes { get; set; }
    public DbSet<Subject> Subjects { get; set; }
    public DbSet<ClassTeacher> ClassTeachers { get; set; }
    public DbSet<Attendance> Attendances { get; set; }
    public DbSet<Exam> Exams { get; set; }
    public DbSet<Grade> Grades { get; set; }
    public DbSet<Salary> Salaries { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Configure SQLite-specific settings
        modelBuilder.Entity<User>().Property(e => e.PasswordResetTokenExpires)
            .HasColumnType("TEXT");
        
        modelBuilder.Entity<Class>().Property(e => e.StartTime)
            .HasColumnType("TEXT");
        
        modelBuilder.Entity<Class>().Property(e => e.EndTime)
            .HasColumnType("TEXT");
        
        modelBuilder.Entity<Exam>().Property(e => e.Duration)
            .HasColumnType("TEXT");
        
        modelBuilder.Entity<Exam>().Property(e => e.ExamDate)
            .HasColumnType("TEXT");
        
        modelBuilder.Entity<Attendance>().Property(e => e.Date)
            .HasColumnType("TEXT");
        
        modelBuilder.Entity<Salary>().Property(e => e.PaidDate)
            .HasColumnType("TEXT");
        
        // Configure decimal properties for SQLite
        modelBuilder.Entity<Teacher>().Property(e => e.BaseSalary)
            .HasColumnType("REAL");
        
        modelBuilder.Entity<Teacher>().Property(e => e.HourlyRate)
            .HasColumnType("REAL");
        
        modelBuilder.Entity<Exam>().Property(e => e.TotalMarks)
            .HasColumnType("REAL");
        
        modelBuilder.Entity<Exam>().Property(e => e.PassingMarks)
            .HasColumnType("REAL");
        
        modelBuilder.Entity<Grade>().Property(e => e.MarksObtained)
            .HasColumnType("REAL");
        
        modelBuilder.Entity<Salary>().Property(e => e.BaseSalary)
            .HasColumnType("REAL");
        
        modelBuilder.Entity<Salary>().Property(e => e.HoursWorked)
            .HasColumnType("REAL");
        
        modelBuilder.Entity<Salary>().Property(e => e.Bonus)
            .HasColumnType("REAL");
        
        modelBuilder.Entity<Salary>().Property(e => e.Deductions)
            .HasColumnType("REAL");
        
        modelBuilder.Entity<Salary>().Property(e => e.TotalSalary)
            .HasColumnType("REAL");
        
        // Configure enum properties for SQLite
        modelBuilder.Entity<User>().Property(e => e.Gender)
            .HasConversion<int>();
        
        modelBuilder.Entity<User>().Property(e => e.Role)
            .HasConversion<int>();
        
        modelBuilder.Entity<Teacher>().Property(e => e.SalaryType)
            .HasConversion<int>();
        
        modelBuilder.Entity<Exam>().Property(e => e.Type)
            .HasConversion<int>();
        
        modelBuilder.Entity<Attendance>().Property(e => e.Status)
            .HasConversion<int>();
        
        modelBuilder.Entity<Salary>().Property(e => e.Status)
            .HasConversion<int>();
        
        // Configure BaseEntity properties for SQLite
        modelBuilder.Entity<User>().Property(e => e.CreatedAt)
            .HasColumnType("TEXT");
        
        modelBuilder.Entity<User>().Property(e => e.UpdatedAt)
            .HasColumnType("TEXT");
        
        modelBuilder.Entity<User>().Property(e => e.CreatedBy)
            .HasMaxLength(100);
        
        modelBuilder.Entity<User>().Property(e => e.UpdatedBy)
            .HasMaxLength(100);
        
        // Configure BaseEntity properties for other entities
        modelBuilder.Entity<Student>().Property(e => e.CreatedAt)
            .HasColumnType("TEXT");
        
        modelBuilder.Entity<Student>().Property(e => e.UpdatedAt)
            .HasColumnType("TEXT");
        
        modelBuilder.Entity<Student>().Property(e => e.CreatedBy)
            .HasMaxLength(100);
        
        modelBuilder.Entity<Student>().Property(e => e.UpdatedBy)
            .HasMaxLength(100);
        
        modelBuilder.Entity<Teacher>().Property(e => e.CreatedAt)
            .HasColumnType("TEXT");
        
        modelBuilder.Entity<Teacher>().Property(e => e.UpdatedAt)
            .HasColumnType("TEXT");
        
        modelBuilder.Entity<Teacher>().Property(e => e.CreatedBy)
            .HasMaxLength(100);
        
        modelBuilder.Entity<Teacher>().Property(e => e.UpdatedBy)
            .HasMaxLength(100);
        
        modelBuilder.Entity<Class>().Property(e => e.CreatedAt)
            .HasColumnType("TEXT");
        
        modelBuilder.Entity<Class>().Property(e => e.UpdatedAt)
            .HasColumnType("TEXT");
        
        modelBuilder.Entity<Class>().Property(e => e.CreatedBy)
            .HasMaxLength(100);
        
        modelBuilder.Entity<Class>().Property(e => e.UpdatedBy)
            .HasMaxLength(100);
        
        modelBuilder.Entity<Subject>().Property(e => e.CreatedAt)
            .HasColumnType("TEXT");
        
        modelBuilder.Entity<Subject>().Property(e => e.UpdatedAt)
            .HasColumnType("TEXT");
        
        modelBuilder.Entity<Subject>().Property(e => e.CreatedBy)
            .HasMaxLength(100);
        
        modelBuilder.Entity<Subject>().Property(e => e.UpdatedBy)
            .HasMaxLength(100);
        
        modelBuilder.Entity<Exam>().Property(e => e.CreatedAt)
            .HasColumnType("TEXT");
        
        modelBuilder.Entity<Exam>().Property(e => e.UpdatedAt)
            .HasColumnType("TEXT");
        
        modelBuilder.Entity<Exam>().Property(e => e.CreatedBy)
            .HasMaxLength(100);
        
        modelBuilder.Entity<Exam>().Property(e => e.UpdatedBy)
            .HasMaxLength(100);
        
        modelBuilder.Entity<Grade>().Property(e => e.CreatedAt)
            .HasColumnType("TEXT");
        
        modelBuilder.Entity<Grade>().Property(e => e.UpdatedAt)
            .HasColumnType("TEXT");
        
        modelBuilder.Entity<Grade>().Property(e => e.CreatedBy)
            .HasMaxLength(100);
        
        modelBuilder.Entity<Grade>().Property(e => e.UpdatedBy)
            .HasMaxLength(100);
        
        modelBuilder.Entity<Attendance>().Property(e => e.CreatedAt)
            .HasColumnType("TEXT");
        
        modelBuilder.Entity<Attendance>().Property(e => e.UpdatedAt)
            .HasColumnType("TEXT");
        
        modelBuilder.Entity<Attendance>().Property(e => e.CreatedBy)
            .HasMaxLength(100);
        
        modelBuilder.Entity<Attendance>().Property(e => e.UpdatedBy)
            .HasMaxLength(100);
        
        modelBuilder.Entity<Salary>().Property(e => e.CreatedAt)
            .HasColumnType("TEXT");
        
        modelBuilder.Entity<Salary>().Property(e => e.UpdatedAt)
            .HasColumnType("TEXT");
        
        modelBuilder.Entity<Salary>().Property(e => e.CreatedBy)
            .HasMaxLength(100);
        
        modelBuilder.Entity<Salary>().Property(e => e.UpdatedBy)
            .HasMaxLength(100);
        
        modelBuilder.Entity<ClassTeacher>().Property(e => e.CreatedAt)
            .HasColumnType("TEXT");
        
        modelBuilder.Entity<ClassTeacher>().Property(e => e.UpdatedAt)
            .HasColumnType("TEXT");
        
        modelBuilder.Entity<ClassTeacher>().Property(e => e.CreatedBy)
            .HasMaxLength(100);
        
        modelBuilder.Entity<ClassTeacher>().Property(e => e.UpdatedBy)
            .HasMaxLength(100);

        // User Configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(50);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(50);
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.PhoneNumber).IsRequired().HasMaxLength(20);
            entity.Property(e => e.DateOfBirth).IsRequired();
            entity.Property(e => e.Gender).IsRequired();
            entity.Property(e => e.Address).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Role).IsRequired();
            entity.Property(e => e.IsActive).IsRequired();
            entity.Property(e => e.PasswordResetToken).HasMaxLength(500);
            entity.Property(e => e.PasswordResetTokenExpires);
        });

        // Student Configuration
        modelBuilder.Entity<Student>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.StudentNumber).IsRequired().HasMaxLength(20);
            entity.HasIndex(e => e.StudentNumber).IsUnique();
            entity.Property(e => e.EnrollmentDate).IsRequired();
            entity.Property(e => e.ClassId).IsRequired();
            entity.Property(e => e.GuardianName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.GuardianPhone).IsRequired().HasMaxLength(20);
            entity.Property(e => e.GuardianEmail).IsRequired().HasMaxLength(100);
            
            entity.HasOne(e => e.User)
                .WithOne(u => u.Student)
                .HasForeignKey<Student>(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.Class)
                .WithMany(c => c.Students)
                .HasForeignKey(e => e.ClassId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Teacher Configuration
        modelBuilder.Entity<Teacher>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserId).IsRequired();
            entity.Property(e => e.EmployeeNumber).IsRequired().HasMaxLength(20);
            entity.HasIndex(e => e.EmployeeNumber).IsUnique();
            entity.Property(e => e.HireDate).IsRequired();
            entity.Property(e => e.Qualification).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Specialization).IsRequired().HasMaxLength(100);
            entity.Property(e => e.BaseSalary).IsRequired();
            entity.Property(e => e.SalaryType).IsRequired();
            entity.Property(e => e.HourlyRate).IsRequired();
            
            entity.HasOne(e => e.User)
                .WithOne(u => u.Teacher)
                .HasForeignKey<Teacher>(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Class Configuration
        modelBuilder.Entity<Class>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Capacity).IsRequired();
            entity.Property(e => e.Room).IsRequired().HasMaxLength(50);
            entity.Property(e => e.StartTime).IsRequired();
            entity.Property(e => e.EndTime).IsRequired();
        });

        // Subject Configuration
        modelBuilder.Entity<Subject>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Code).IsRequired().HasMaxLength(10);
            entity.HasIndex(e => e.Code).IsUnique();
            entity.Property(e => e.Description).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Credits).IsRequired();
        });

        // ClassTeacher Configuration
        modelBuilder.Entity<ClassTeacher>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ClassId).IsRequired();
            entity.Property(e => e.TeacherId).IsRequired();
            entity.Property(e => e.SubjectId).IsRequired();
            entity.Property(e => e.IsPrimary).IsRequired();
            
            entity.HasOne(e => e.Class)
                .WithMany(c => c.ClassTeachers)
                .HasForeignKey(e => e.ClassId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.Teacher)
                .WithMany(t => t.ClassTeachers)
                .HasForeignKey(e => e.TeacherId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.Subject)
                .WithMany(s => s.Classes)
                .HasForeignKey(e => e.SubjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Attendance Configuration
        modelBuilder.Entity<Attendance>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Date).IsRequired();
            entity.Property(e => e.ClassId).IsRequired();
            entity.Property(e => e.Status).IsRequired();
            entity.Property(e => e.Remarks).HasMaxLength(500);
            
            entity.HasOne(e => e.Class)
                .WithMany(c => c.Attendances)
                .HasForeignKey(e => e.ClassId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.Student)
                .WithMany(s => s.Attendances)
                .HasForeignKey(e => e.StudentId)
                .OnDelete(DeleteBehavior.Restrict);
                
            entity.HasOne(e => e.Teacher)
                .WithMany(t => t.Attendances)
                .HasForeignKey(e => e.TeacherId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Exam Configuration
        modelBuilder.Entity<Exam>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).IsRequired().HasMaxLength(500);
            entity.Property(e => e.ExamDate).IsRequired();
            entity.Property(e => e.Duration).IsRequired();
            entity.Property(e => e.TotalMarks).IsRequired();
            entity.Property(e => e.PassingMarks).IsRequired();
            entity.Property(e => e.Type).IsRequired();
            entity.Property(e => e.ClassId).IsRequired();
            entity.Property(e => e.SubjectId).IsRequired();
            
            entity.HasOne(e => e.Class)
                .WithMany(c => c.Exams)
                .HasForeignKey(e => e.ClassId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.Subject)
                .WithMany(s => s.Exams)
                .HasForeignKey(e => e.SubjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Grade Configuration
        modelBuilder.Entity<Grade>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.StudentId).IsRequired();
            entity.Property(e => e.ExamId).IsRequired();
            entity.Property(e => e.MarksObtained).IsRequired();
            entity.Property(e => e.GradeValue).IsRequired().HasMaxLength(10);
            entity.Property(e => e.IsPassed).IsRequired();
            entity.Property(e => e.Remarks).HasMaxLength(500);
            
            entity.HasOne(e => e.Student)
                .WithMany(s => s.Grades)
                .HasForeignKey(e => e.StudentId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.Exam)
                .WithMany(ex => ex.Grades)
                .HasForeignKey(e => e.ExamId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Salary Configuration
        modelBuilder.Entity<Salary>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TeacherId).IsRequired();
            entity.Property(e => e.Month).IsRequired();
            entity.Property(e => e.Year).IsRequired();
            entity.Property(e => e.BaseSalary).IsRequired();
            entity.Property(e => e.HoursWorked).IsRequired();
            entity.Property(e => e.Bonus).IsRequired();
            entity.Property(e => e.Deductions).IsRequired();
            entity.Property(e => e.TotalSalary).IsRequired();
            entity.Property(e => e.Status).IsRequired();
            
            entity.HasOne(e => e.Teacher)
                .WithMany(t => t.Salaries)
                .HasForeignKey(e => e.TeacherId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Many-to-many relationship between Class and Subject
        modelBuilder.Entity<Class>()
            .HasMany(c => c.Subjects)
            .WithMany(s => s.Classes)
            .UsingEntity(j => j.ToTable("ClassSubjects"));
        
        // Configure the junction table properties
        modelBuilder.Entity("ClassSubjects", entity =>
        {
            entity.Property("ClassesId").IsRequired();
            entity.Property("SubjectsId").IsRequired();
        });
    }
}