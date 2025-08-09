using SchoolManagement.Domain.Enums;

namespace SchoolManagement.Domain.Entities;

public class Salary : BaseEntity
{
    public int TeacherId { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
    public decimal BaseSalary { get; set; }
    public decimal HoursWorked { get; set; }
    public decimal Bonus { get; set; }
    public decimal Deductions { get; set; }
    public decimal TotalSalary { get; set; }
    public SalaryStatus Status { get; set; }
    public DateTime? PaidDate { get; set; }
    
    // Navigation properties
    public Teacher Teacher { get; set; } = null!;
}