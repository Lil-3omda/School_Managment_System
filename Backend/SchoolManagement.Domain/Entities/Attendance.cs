using SchoolManagement.Domain.Enums;

namespace SchoolManagement.Domain.Entities;

public class Attendance : BaseEntity
{
    public DateTime Date { get; set; }
    public int ClassId { get; set; }
    public int? StudentId { get; set; }
    public int? TeacherId { get; set; }
    public AttendanceStatus Status { get; set; }
    public string? Remarks { get; set; }
    
    // Navigation properties
    public Class Class { get; set; } = null!;
    public Student? Student { get; set; }
    public Teacher? Teacher { get; set; }
}