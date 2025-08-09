namespace SchoolManagement.Domain.Entities;

public class Grade : BaseEntity
{
    public int StudentId { get; set; }
    public int ExamId { get; set; }
    public decimal MarksObtained { get; set; }
    public string? Remarks { get; set; }
    public string GradeValue { get; set; } = string.Empty;
    public bool IsPassed { get; set; }
    
    // Navigation properties
    public Student Student { get; set; } = null!;
    public Exam Exam { get; set; } = null!;
}