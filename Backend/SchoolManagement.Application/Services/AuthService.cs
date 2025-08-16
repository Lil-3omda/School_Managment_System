using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SchoolManagement.Application.Interfaces;
using SchoolManagement.Domain.Entities;
using SchoolManagement.Domain.Enums;
using SchoolManagement.Infrastructure.Data;
using SchoolManagement.Shared.DTOs.Auth;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SchoolManagement.Application.Services;

public class AuthService : IAuthService
{
    private readonly SchoolDbContext _context;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;

    public AuthService(SchoolDbContext context, IMapper mapper, IConfiguration configuration)
    {
        _context = context;
        _mapper = mapper;
        _configuration = configuration;
    }

    public async Task<LoginResponseDto> LoginAsync(LoginDto loginDto)
    {
        if (loginDto == null)
            throw new ArgumentException("بيانات تسجيل الدخول مطلوبة");

        if (string.IsNullOrEmpty(loginDto.Email))
            throw new ArgumentException("البريد الإلكتروني مطلوب");

        if (string.IsNullOrEmpty(loginDto.Password))
            throw new ArgumentException("كلمة المرور مطلوبة");

        var user = await GetUserByEmailAsync(loginDto.Email);
        if (user == null || !await ValidatePasswordAsync(loginDto.Email, loginDto.Password))
        {
            throw new UnauthorizedAccessException("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        }

        if (!user.IsActive)
        {
            throw new UnauthorizedAccessException("الحساب غير مفعل");
        }

        var token = await GenerateJwtTokenAsync(user);
        
        return new LoginResponseDto
        {
            Token = token,
            RefreshToken = Guid.NewGuid().ToString(),
            Expires = DateTime.UtcNow.AddHours(24),
            User = user
        };
    }

    public async Task<LoginResponseDto> RegisterAsync(RegisterDto registerDto)
    {
        // Check if user already exists
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == registerDto.Email);
        
        if (existingUser != null)
        {
            throw new InvalidOperationException("المستخدم موجود بالفعل بهذا البريد الإلكتروني");
        }

        // Create new user
        var user = new User
        {
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            Email = registerDto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
            PhoneNumber = registerDto.PhoneNumber,
            DateOfBirth = registerDto.DateOfBirth,
            Gender = registerDto.Gender,
            Address = registerDto.Address,
            Role = registerDto.Role,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var userDto = _mapper.Map<UserDto>(user);
        var token = await GenerateJwtTokenAsync(userDto);

        return new LoginResponseDto
        {
            Token = token,
            RefreshToken = Guid.NewGuid().ToString(),
            Expires = DateTime.UtcNow.AddHours(24),
            User = userDto
        };
    }

    public async Task<LoginResponseDto> RefreshTokenAsync(string refreshToken)
    {
        // In a real application, you would validate the refresh token
        // For now, we'll just return an error
        throw new UnauthorizedAccessException("رمز التحديث غير صالح");
    }

    public async Task<string> GenerateJwtTokenAsync(UserDto user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "your-secret-key-here"));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Email),
            new Claim(ClaimTypes.GivenName, user.FullName),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<UserDto?> GetUserByEmailAsync(string email)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email && !u.IsDeleted);
        
        return user != null ? _mapper.Map<UserDto>(user) : null;
    }

    public async Task<bool> ValidatePasswordAsync(string email, string password)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email && !u.IsDeleted);
        
        if (user == null) return false;
        
        return BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
    }

    public async Task ForgetPasswordAsync(string email)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email && !u.IsDeleted);
        
        if (user == null)
            throw new ArgumentException("البريد الإلكتروني غير موجود");

        // Generate password reset token (in real implementation, this would be a secure token)
        var resetToken = Guid.NewGuid().ToString();
        user.PasswordResetToken = resetToken;
        user.PasswordResetTokenExpires = DateTime.UtcNow.AddHours(1); // Token expires in 1 hour
        
        await _context.SaveChangesAsync();
        
        // In real implementation, send email with reset link
        // For now, we'll just simulate the email sending
        // EmailService.SendPasswordResetEmail(email, resetToken);
    }

    public async Task ResetPasswordAsync(string token, string newPassword)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.PasswordResetToken == token && 
                                     u.PasswordResetTokenExpires > DateTime.UtcNow && 
                                     !u.IsDeleted);
        
        if (user == null)
            throw new ArgumentException("رمز إعادة التعيين غير صحيح أو منتهي الصلاحية");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        user.PasswordResetToken = null;
        user.PasswordResetTokenExpires = null;
        
        await _context.SaveChangesAsync();
    }
}