namespace SchoolManagement.Shared.DTOs.Schedules;

public class ScheduleDto
{
    public int Id { get; set; }
    public string DayOfWeek { get; set; } = string.Empty;
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public string SubjectName { get; set; } = string.Empty;
    public string ClassName { get; set; } = string.Empty;
    public string TeacherName { get; set; } = string.Empty;
    public string Room { get; set; } = string.Empty;
    public int ClassId { get; set; }
    public int SubjectId { get; set; }
    public int? TeacherId { get; set; }
}