using SchoolManagement.Domain.Enums;
using SchoolManagement.Shared.DTOs.Common;

namespace SchoolManagement.Shared.DTOs.Exams;

public class ExamDto : BaseDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime ExamDate { get; set; }
    public TimeSpan Duration { get; set; }
    public decimal TotalMarks { get; set; }
    public decimal PassingMarks { get; set; }
    public ExamType Type { get; set; }
    public int ClassId { get; set; }
    public string ClassName { get; set; } = string.Empty;
    public int SubjectId { get; set; }
    public string SubjectName { get; set; } = string.Empty;
}