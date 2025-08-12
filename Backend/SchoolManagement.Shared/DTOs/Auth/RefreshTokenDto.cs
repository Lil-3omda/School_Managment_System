using System.ComponentModel.DataAnnotations;

namespace SchoolManagement.Shared.DTOs.Auth;

public class RefreshTokenDto
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}