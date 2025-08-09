using SchoolManagement.Shared.DTOs.Auth;

namespace SchoolManagement.Application.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto> LoginAsync(LoginDto loginDto);
    Task<string> GenerateJwtTokenAsync(UserDto user);
    Task<UserDto?> GetUserByEmailAsync(string email);
    Task<bool> ValidatePasswordAsync(string email, string password);
}