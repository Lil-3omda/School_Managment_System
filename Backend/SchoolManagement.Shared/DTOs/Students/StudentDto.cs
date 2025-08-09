using SchoolManagement.Shared.DTOs.Auth;
using SchoolManagement.Shared.DTOs.Common;

namespace SchoolManagement.Shared.DTOs.Students;

public class StudentDto : BaseDto
{
    public int UserId { get; set; }
    public string StudentNumber { get; set; } = string.Empty;
    public DateTime EnrollmentDate { get; set; }
    public int ClassId { get; set; }
    public string ClassName { get; set; } = string.Empty;
    public string GuardianName { get; set; } = string.Empty;
    public string GuardianPhone { get; set; } = string.Empty;
    public string GuardianEmail { get; set; } = string.Empty;
    public UserDto User { get; set; } = null!;
}