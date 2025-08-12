using SchoolManagement.Shared.DTOs.Common;

namespace SchoolManagement.Shared.DTOs.Classes;

public class ClassDto : BaseDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public string Room { get; set; } = string.Empty;
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public int StudentCount { get; set; }
}