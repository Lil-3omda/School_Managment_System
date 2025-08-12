using System.ComponentModel.DataAnnotations;

namespace SchoolManagement.Shared.DTOs.Classes;

public class CreateClassDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    [Range(1, 50)]
    public int Capacity { get; set; }
    
    [Required]
    public string Room { get; set; } = string.Empty;
    
    [Required]
    public TimeSpan StartTime { get; set; }
    
    [Required]
    public TimeSpan EndTime { get; set; }
}