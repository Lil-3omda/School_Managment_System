using SchoolManagement.Domain.Enums;
using SchoolManagement.Shared.DTOs.Common;

namespace SchoolManagement.Shared.DTOs.Salaries;

public class SalaryDto : BaseDto
{
    public int TeacherId { get; set; }
    public string TeacherName { get; set; } = string.Empty;
    public int Month { get; set; }
    public int Year { get; set; }
    public decimal BaseSalary { get; set; }
    public decimal HoursWorked { get; set; }
    public decimal Bonus { get; set; }
    public decimal Deductions { get; set; }
    public decimal TotalSalary { get; set; }
    public SalaryStatus Status { get; set; }
    public DateTime? PaidDate { get; set; }
}