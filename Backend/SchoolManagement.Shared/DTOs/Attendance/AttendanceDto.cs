using SchoolManagement.Domain.Enums;
using SchoolManagement.Shared.DTOs.Common;

namespace SchoolManagement.Shared.DTOs.Attendance;

public class AttendanceDto : BaseDto
{
    public DateTime Date { get; set; }
    public int ClassId { get; set; }
    public string ClassName { get; set; } = string.Empty;
    public int? StudentId { get; set; }
    public string? StudentName { get; set; }
    public int? TeacherId { get; set; }
    public string? TeacherName { get; set; }
    public AttendanceStatus Status { get; set; }
    public string? Remarks { get; set; }
}