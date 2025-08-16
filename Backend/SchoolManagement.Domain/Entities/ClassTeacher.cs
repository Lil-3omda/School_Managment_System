namespace SchoolManagement.Domain.Entities;

public class ClassTeacher : BaseEntity
{
    public int ClassId { get; set; }
    public int TeacherId { get; set; }
    public int SubjectId { get; set; }
    public bool IsPrimary { get; set; }
    
    // Navigation properties
    public Class Class { get; set; } = null!;
    public Teacher Teacher { get; set; } = null!;
    public Subject Subject { get; set; } = null!;
}