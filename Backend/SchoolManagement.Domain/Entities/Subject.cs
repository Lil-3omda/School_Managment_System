namespace SchoolManagement.Domain.Entities;

public class Subject : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Credits { get; set; }
    
    // Navigation properties
    public ICollection<Class> Classes { get; set; } = new List<Class>();
    public ICollection<Exam> Exams { get; set; } = new List<Exam>();
}