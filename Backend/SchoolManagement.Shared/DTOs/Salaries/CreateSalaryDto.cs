using SchoolManagement.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace SchoolManagement.Shared.DTOs.Salaries;

public class CreateSalaryDto
{
    [Required]
    public int TeacherId { get; set; }
    
    [Required]
    [Range(1, 12)]
    public int Month { get; set; }
    
    [Required]
    public int Year { get; set; }
    
    [Required]
    [Range(0, 100000)]
    public decimal BaseSalary { get; set; }
    
    [Required]
    [Range(0, 500)]
    public decimal HoursWorked { get; set; }
    
    [Range(0, 10000)]
    public decimal Bonus { get; set; }
    
    [Range(0, 10000)]
    public decimal Deductions { get; set; }
    
    [Required]
    [Range(0, 100000)]
    public decimal TotalSalary { get; set; }
    
    [Required]
    public SalaryStatus Status { get; set; }
    
    public DateTime? PaidDate { get; set; }
}