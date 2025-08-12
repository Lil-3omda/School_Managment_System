using SchoolManagement.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace SchoolManagement.Shared.DTOs.Teachers;

public class CreateTeacherDto
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
    public string EmployeeNumber { get; set; } = string.Empty;
    
    [Required]
    public DateTime HireDate { get; set; }
    
    [Required]
    public string Qualification { get; set; } = string.Empty;
    
    [Required]
    public string Specialization { get; set; } = string.Empty;
    
    [Required]
    public decimal BaseSalary { get; set; }
    
    [Required]
    public SalaryType SalaryType { get; set; }
    
    public decimal HourlyRate { get; set; }
}