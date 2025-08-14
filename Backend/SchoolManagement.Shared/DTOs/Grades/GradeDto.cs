using SchoolManagement.Shared.DTOs.Common;

namespace SchoolManagement.Shared.DTOs.Grades;

public class GradeDto : BaseDto
{
    public int StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public int ExamId { get; set; }
    public string ExamName { get; set; } = string.Empty;
    public string SubjectName { get; set; } = string.Empty;
    public decimal MarksObtained { get; set; }
    public decimal TotalMarks { get; set; }
    public string GradeValue { get; set; } = string.Empty;
    public bool IsPassed { get; set; }
    public string? Remarks { get; set; }
    public DateTime ExamDate { get; set; }
}