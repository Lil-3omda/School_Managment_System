using System.ComponentModel.DataAnnotations;

namespace SchoolManagement.Shared.DTOs.Subjects;

public class CreateSubjectDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [StringLength(10)]
    public string Code { get; set; } = string.Empty;
    
    [Required]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    [Range(1, 10)]
    public int Credits { get; set; }
}