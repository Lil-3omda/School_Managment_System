using SchoolManagement.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace SchoolManagement.Shared.DTOs.Attendance;

public class CreateAttendanceDto
{
    [Required]
    public DateTime Date { get; set; }
    
    [Required]
    public int ClassId { get; set; }
    
    public int? StudentId { get; set; }
    
    public int? TeacherId { get; set; }
    
    [Required]
    public AttendanceStatus Status { get; set; }
    
    public string? Remarks { get; set; }
}