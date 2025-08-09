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

        // User Configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(50);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(50);
            entity.Property(e => e.PasswordHash).IsRequired();
        });

        // Student Configuration
        modelBuilder.Entity<Student>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.StudentNumber).IsRequired().HasMaxLength(20);
            entity.HasIndex(e => e.StudentNumber).IsUnique();
            
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
            entity.Property(e => e.EmployeeNumber).IsRequired().HasMaxLength(20);
            entity.HasIndex(e => e.EmployeeNumber).IsUnique();
            entity.Property(e => e.BaseSalary).HasColumnType("decimal(18,2)");
            entity.Property(e => e.HourlyRate).HasColumnType("decimal(18,2)");
            
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
        });

        // Subject Configuration
        modelBuilder.Entity<Subject>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Code).IsRequired().HasMaxLength(10);
            entity.HasIndex(e => e.Code).IsUnique();
        });

        // ClassTeacher Configuration
        modelBuilder.Entity<ClassTeacher>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.HasOne(e => e.Class)
                .WithMany(c => c.ClassTeachers)
                .HasForeignKey(e => e.ClassId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.Teacher)
                .WithMany(t => t.ClassTeachers)
                .HasForeignKey(e => e.TeacherId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Attendance Configuration
        modelBuilder.Entity<Attendance>(entity =>
        {
            entity.HasKey(e => e.Id);
            
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
            entity.Property(e => e.TotalMarks).HasColumnType("decimal(18,2)");
            entity.Property(e => e.PassingMarks).HasColumnType("decimal(18,2)");
            
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
            entity.Property(e => e.MarksObtained).HasColumnType("decimal(18,2)");
            
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
            entity.Property(e => e.BaseSalary).HasColumnType("decimal(18,2)");
            entity.Property(e => e.HoursWorked).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Bonus).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Deductions).HasColumnType("decimal(18,2)");
            entity.Property(e => e.TotalSalary).HasColumnType("decimal(18,2)");
            
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
    }
}