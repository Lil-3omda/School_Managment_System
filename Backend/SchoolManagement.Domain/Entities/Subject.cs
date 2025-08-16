namespace SchoolManagement.Domain.Entities;

public class Subject : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Credits { get; set; }
    
    // Navigation properties
    public ICollection<ClassTeacher> ClassTeachers { get; set; } = new List<ClassTeacher>();
    public ICollection<Exam> Exams { get; set; } = new List<Exam>();
    
    // Helper method to get classes through ClassTeacher
    public IEnumerable<Class> GetClasses() => ClassTeachers.Select(ct => ct.Class).Distinct();
}