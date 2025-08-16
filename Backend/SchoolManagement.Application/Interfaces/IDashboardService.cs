using SchoolManagement.Shared.DTOs.Common;

namespace SchoolManagement.Application.Interfaces;

public interface IDashboardService
{
    Task<DashboardStatisticsDto> GetDashboardStatisticsAsync();
    Task<List<RecentActivityDto>> GetRecentActivitiesAsync();
    Task<List<NotificationDto>> GetNotificationsAsync();
    Task MarkNotificationAsReadAsync(int id);
}