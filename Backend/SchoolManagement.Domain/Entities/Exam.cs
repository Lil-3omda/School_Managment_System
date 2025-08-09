using SchoolManagement.Domain.Enums;

namespace SchoolManagement.Domain.Entities;

public class Exam : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime ExamDate { get; set; }
    public TimeSpan Duration { get; set; }
    public decimal TotalMarks { get; set; }
    public decimal PassingMarks { get; set; }
    public ExamType Type { get; set; }
    public int ClassId { get; set; }
    public int SubjectId { get; set; }
    
    // Navigation properties
    public Class Class { get; set; } = null!;
    public Subject Subject { get; set; } = null!;
    public ICollection<Grade> Grades { get; set; } = new List<Grade>();
}