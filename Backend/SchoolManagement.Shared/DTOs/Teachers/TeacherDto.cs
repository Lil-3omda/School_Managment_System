using SchoolManagement.Domain.Enums;
using SchoolManagement.Shared.DTOs.Auth;
using SchoolManagement.Shared.DTOs.Common;

namespace SchoolManagement.Shared.DTOs.Teachers;

public class TeacherDto : BaseDto
{
    public int UserId { get; set; }
    public string EmployeeNumber { get; set; } = string.Empty;
    public DateTime HireDate { get; set; }
    public string Qualification { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public decimal BaseSalary { get; set; }
    public SalaryType SalaryType { get; set; }
    public decimal HourlyRate { get; set; }
    public UserDto User { get; set; } = null!;
}