using SchoolManagement.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace SchoolManagement.Shared.DTOs.Students;

public class CreateStudentDto
{
    [Required]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    public string LastName { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public string PhoneNumber { get; set; } = string.Empty;
    
    [Required]
    public DateTime DateOfBirth { get; set; }
    
    [Required]
    public Gender Gender { get; set; }
    
    [Required]
    public string Address { get; set; } = string.Empty;
    
    [Required]
    public string StudentNumber { get; set; } = string.Empty;
    
    [Required]
    public DateTime EnrollmentDate { get; set; }
    
    [Required]
    public int ClassId { get; set; }
    
    [Required]
    public string GuardianName { get; set; } = string.Empty;
    
    [Required]
    public string GuardianPhone { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    public string GuardianEmail { get; set; } = string.Empty;
}