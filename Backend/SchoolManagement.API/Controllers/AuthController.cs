using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Application.Interfaces;
using SchoolManagement.Shared.DTOs.Auth;

namespace SchoolManagement.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Login with email and password
    /// </summary>
    /// <param name="loginDto">Login credentials</param>
    /// <returns>JWT token and user information</returns>
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginDto loginDto)
    {
        try
        {
            if (loginDto == null)
            {
                return BadRequest(new { message = "بيانات تسجيل الدخول مطلوبة" });
            }

            if (string.IsNullOrEmpty(loginDto.Email) || string.IsNullOrEmpty(loginDto.Password))
            {
                return BadRequest(new { message = "البريد الإلكتروني وكلمة المرور مطلوبان" });
            }

            var result = await _authService.LoginAsync(loginDto);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "حدث خطأ في الخادم", details = ex.Message });
        }
    }

    /// <summary>
    /// Register a new user
    /// </summary>
    /// <param name="registerDto">Registration information</param>
    /// <returns>JWT token and user information</returns>
    [HttpPost("register")]
    public async Task<ActionResult<LoginResponseDto>> Register([FromBody] RegisterDto registerDto)
    {
        try
        {
            var result = await _authService.RegisterAsync(registerDto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get current user information
    /// </summary>
    /// <returns>Current user details</returns>
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var email = User.Identity?.Name;
        if (string.IsNullOrEmpty(email))
        {
            return Unauthorized();
        }

        var user = await _authService.GetUserByEmailAsync(email);
        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    /// <summary>
    /// Refresh JWT token
    /// </summary>
    /// <param name="refreshTokenDto">Refresh token</param>
    /// <returns>New JWT token</returns>
    [HttpPost("refresh")]
    public async Task<ActionResult<LoginResponseDto>> RefreshToken([FromBody] RefreshTokenDto refreshTokenDto)
    {
        try
        {
            var result = await _authService.RefreshTokenAsync(refreshTokenDto.RefreshToken);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Logout user
    /// </summary>
    /// <returns>Success message</returns>
    [HttpPost("logout")]
    [Authorize]
    public async Task<ActionResult> Logout()
    {
        // In a real application, you might want to blacklist the token
        return Ok(new { message = "تم تسجيل الخروج بنجاح" });
    }

    /// <summary>
    /// Send forget password email
    /// </summary>
    /// <param name="forgetPasswordDto">Email for password reset</param>
    /// <returns>Success message</returns>
    [HttpPost("forget-password")]
    public async Task<ActionResult> ForgetPassword([FromBody] ForgetPasswordDto forgetPasswordDto)
    {
        try
        {
            if (string.IsNullOrEmpty(forgetPasswordDto.Email))
            {
                return BadRequest(new { message = "البريد الإلكتروني مطلوب" });
            }

            await _authService.ForgetPasswordAsync(forgetPasswordDto.Email);
            return Ok(new { message = "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Reset password using token
    /// </summary>
    /// <param name="resetPasswordDto">Reset password data</param>
    /// <returns>Success message</returns>
    [HttpPost("reset-password")]
    public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
    {
        try
        {
            await _authService.ResetPasswordAsync(resetPasswordDto.Token, resetPasswordDto.NewPassword);
            return Ok(new { message = "تم تغيير كلمة المرور بنجاح" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}