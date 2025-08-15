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
        var statistics = await _dashboardService.GetDashboardStatisticsAsync();
        return Ok(statistics);
    }

    [HttpGet("activities")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<RecentActivityDto>>> GetRecentActivities()
    {
        var activities = await _dashboardService.GetRecentActivitiesAsync();
        return Ok(activities);
    }

    [HttpGet("notifications")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<NotificationDto>>> GetNotifications()
    {
        var notifications = await _dashboardService.GetNotificationsAsync();
        return Ok(notifications);
    }

    [HttpPatch("notifications/{id}/read")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> MarkNotificationAsRead(int id)
    {
        await _dashboardService.MarkNotificationAsReadAsync(id);
        return NoContent();
    }
}