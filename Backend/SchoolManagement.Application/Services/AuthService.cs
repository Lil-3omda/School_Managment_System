using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SchoolManagement.Application.Interfaces;
using SchoolManagement.Domain.Entities;
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
        var user = await GetUserByEmailAsync(loginDto.Email);
        if (user == null || !await ValidatePasswordAsync(loginDto.Email, loginDto.Password))
        {
            throw new UnauthorizedAccessException("Invalid email or password");
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

    public async Task<string> GenerateJwtTokenAsync(UserDto user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "your-secret-key-here"));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.FullName),
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
        
        // In a real application, you would use proper password hashing
        // For demo purposes, we'll use simple comparison
        return BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
    }
}