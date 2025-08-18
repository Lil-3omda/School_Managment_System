using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Application.Interfaces;
using SchoolManagement.Shared.DTOs.Common;

namespace SchoolManagement.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("statistics")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<DashboardStatisticsDto>> GetStatistics()
    {
        try
        {
            var statistics = await _dashboardService.GetDashboardStatisticsAsync();
            return Ok(statistics);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "خطأ في تحميل الإحصائيات", details = ex.Message });
        }
    }

    [HttpGet("activities")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<RecentActivityDto>>> GetRecentActivities()
    {
        try
        {
            var activities = await _dashboardService.GetRecentActivitiesAsync();
            return Ok(activities);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "خطأ في تحميل الأنشطة", details = ex.Message });
        }
    }

    [HttpGet("notifications")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<NotificationDto>>> GetNotifications()
    {
        try
        {
            var notifications = await _dashboardService.GetNotificationsAsync();
            return Ok(notifications);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "خطأ في تحميل الإشعارات", details = ex.Message });
        }
    }

    [HttpPatch("notifications/{id}/read")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> MarkNotificationAsRead(int id)
    {
        try
        {
            await _dashboardService.MarkNotificationAsReadAsync(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "خطأ في تحديث الإشعار", details = ex.Message });
        }
    }

    [HttpGet("refresh")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<object>> RefreshDashboard()
    {
        try
        {
            var statistics = await _dashboardService.GetDashboardStatisticsAsync();
            var activities = await _dashboardService.GetRecentActivitiesAsync();
            var notifications = await _dashboardService.GetNotificationsAsync();

            return Ok(new
            {
                statistics,
                activities,
                notifications,
                lastUpdated = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "خطأ في تحديث لوحة التحكم", details = ex.Message });
        }
    }
}