using System.ComponentModel.DataAnnotations;

namespace SchoolManagement.Shared.DTOs.Auth;

public class ForgetPasswordDto
{
    [Required(ErrorMessage = "البريد الإلكتروني مطلوب")]
    [EmailAddress(ErrorMessage = "البريد الإلكتروني غير صحيح")]
    public string Email { get; set; } = string.Empty;
}