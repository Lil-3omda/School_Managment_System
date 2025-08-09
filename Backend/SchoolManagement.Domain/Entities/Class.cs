namespace SchoolManagement.Domain.Entities;

public class Class : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public string Room { get; set; } = string.Empty;
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    
    // Navigation properties
    public ICollection<Student> Students { get; set; } = new List<Student>();
    public ICollection<ClassTeacher> ClassTeachers { get; set; } = new List<ClassTeacher>();
    public ICollection<Subject> Subjects { get; set; } = new List<Subject>();
    public ICollection<Exam> Exams { get; set; } = new List<Exam>();
    public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
}