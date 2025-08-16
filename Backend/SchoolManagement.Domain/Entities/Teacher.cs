using SchoolManagement.Domain.Enums;

namespace SchoolManagement.Domain.Entities;

public class Teacher : BaseEntity
{
    public int UserId { get; set; }
    public string EmployeeNumber { get; set; } = string.Empty;
    public DateTime HireDate { get; set; }
    public string Qualification { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public decimal BaseSalary { get; set; }
    public SalaryType SalaryType { get; set; }
    public decimal HourlyRate { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public ICollection<ClassTeacher> ClassTeachers { get; set; } = new List<ClassTeacher>();
    public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
    public ICollection<Salary> Salaries { get; set; } = new List<Salary>();
    
    // Helper method to get classes through ClassTeacher
    public IEnumerable<Class> GetClasses() => ClassTeachers.Select(ct => ct.Class).Distinct();
    
    // Helper method to get subjects through ClassTeacher
    public IEnumerable<Subject> GetSubjects() => ClassTeachers.Select(ct => ct.Subject).Distinct();
}