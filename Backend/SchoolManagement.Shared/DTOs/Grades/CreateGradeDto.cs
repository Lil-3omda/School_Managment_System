using System.ComponentModel.DataAnnotations;

namespace SchoolManagement.Shared.DTOs.Grades;

public class CreateGradeDto
{
    [Required]
    public int StudentId { get; set; }
    
    [Required]
    public int ExamId { get; set; }
    
    [Required]
    [Range(0, 1000)]
    public decimal MarksObtained { get; set; }
    
    [Required]
    [StringLength(5)]
    public string GradeValue { get; set; } = string.Empty;
    
    [Required]
    public bool IsPassed { get; set; }
    
    public string? Remarks { get; set; }
}