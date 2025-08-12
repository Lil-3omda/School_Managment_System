using SchoolManagement.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace SchoolManagement.Shared.DTOs.Exams;

public class CreateExamDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    public DateTime ExamDate { get; set; }
    
    [Required]
    public TimeSpan Duration { get; set; }
    
    [Required]
    [Range(1, 1000)]
    public decimal TotalMarks { get; set; }
    
    [Required]
    [Range(1, 1000)]
    public decimal PassingMarks { get; set; }
    
    [Required]
    public ExamType Type { get; set; }
    
    [Required]
    public int ClassId { get; set; }
    
    [Required]
    public int SubjectId { get; set; }
}