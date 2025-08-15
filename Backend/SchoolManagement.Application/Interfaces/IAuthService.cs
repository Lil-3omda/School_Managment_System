using SchoolManagement.Shared.DTOs.Auth;

namespace SchoolManagement.Application.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto> LoginAsync(LoginDto loginDto);
    Task<LoginResponseDto> RegisterAsync(RegisterDto registerDto);
    Task<LoginResponseDto> RefreshTokenAsync(string refreshToken);
    Task<string> GenerateJwtTokenAsync(UserDto user);
    Task<UserDto?> GetUserByEmailAsync(string email);
    Task<bool> ValidatePasswordAsync(string email, string password);
    Task ForgetPasswordAsync(string email);
    Task ResetPasswordAsync(string token, string newPassword);
}