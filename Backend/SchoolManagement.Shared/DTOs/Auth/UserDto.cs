using SchoolManagement.Domain.Enums;
using SchoolManagement.Shared.DTOs.Common;

namespace SchoolManagement.Shared.DTOs.Auth;

public class UserDto : BaseDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public Gender Gender { get; set; }
    public string Address { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public bool IsActive { get; set; }
    public string FullName => $"{FirstName} {LastName}";
}