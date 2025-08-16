using System.ComponentModel.DataAnnotations;

namespace SchoolManagement.Shared.DTOs.Auth;

public class ResetPasswordDto
{
    [Required(ErrorMessage = "رمز إعادة التعيين مطلوب")]
    public string Token { get; set; } = string.Empty;

    [Required(ErrorMessage = "كلمة المرور الجديدة مطلوبة")]
    [MinLength(6, ErrorMessage = "كلمة المرور يجب أن تكون 6 أحرف على الأقل")]
    public string NewPassword { get; set; } = string.Empty;
}