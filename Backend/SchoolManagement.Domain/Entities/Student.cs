namespace SchoolManagement.Domain.Entities;

public class Student : BaseEntity
{
    public int UserId { get; set; }
    public string StudentNumber { get; set; } = string.Empty;
    public DateTime EnrollmentDate { get; set; }
    public int ClassId { get; set; }
    public string GuardianName { get; set; } = string.Empty;
    public string GuardianPhone { get; set; } = string.Empty;
    public string GuardianEmail { get; set; } = string.Empty;
    
    // Navigation properties
    public User User { get; set; } = null!;
    public Class Class { get; set; } = null!;
    public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
    public ICollection<Grade> Grades { get; set; } = new List<Grade>();
}