using SchoolManagement.Application.Interfaces;
using SchoolManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using SchoolManagement.Shared.DTOs.Common;

namespace SchoolManagement.Application.Services;

public class DashboardService : IDashboardService
{
    private readonly SchoolDbContext _context;

    public DashboardService(SchoolDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardStatisticsDto> GetDashboardStatisticsAsync()
    {
        var totalStudents = await _context.Students
            .Where(s => !s.IsDeleted)
            .CountAsync();

        var totalTeachers = await _context.Teachers
            .Where(t => !t.IsDeleted)
            .CountAsync();

        var totalClasses = await _context.Classes
            .Where(c => !c.IsDeleted)
            .CountAsync();

        var upcomingExams = await _context.Exams
            .Where(e => e.ExamDate > DateTime.UtcNow && !e.IsDeleted)
            .CountAsync();
        
        return new DashboardStatisticsDto
        {
            TotalStudents = totalStudents,
            TotalTeachers = totalTeachers,
            TotalClasses = totalClasses,
            UpcomingExams = upcomingExams
        };
    }

    public async Task<List<RecentActivityDto>> GetRecentActivitiesAsync()
    {
        var recentActivities = new List<RecentActivityDto>();

        // Get recent students (last 5)
        var recentStudents = await _context.Students
            .Include(s => s.User)
            .Where(s => !s.IsDeleted)
            .OrderByDescending(s => s.CreatedAt)
            .Take(3)
            .ToListAsync();

        foreach (var student in recentStudents)
        {
            recentActivities.Add(new RecentActivityDto
            {
                Id = student.Id,
                Description = "تم إضافة طالب جديد",
                UserName = student.User.FullName,
                Date = student.CreatedAt,
                Status = "مكتمل",
                Type = "Student"
            });
        }

        // Get recent teachers (last 2)
        var recentTeachers = await _context.Teachers
            .Include(t => t.User)
            .Where(t => !t.IsDeleted)
            .OrderByDescending(t => t.CreatedAt)
            .Take(2)
            .ToListAsync();

        foreach (var teacher in recentTeachers)
        {
            recentActivities.Add(new RecentActivityDto
            {
                Id = teacher.Id,
                Description = "تم إضافة معلم جديد",
                UserName = teacher.User.FullName,
                Date = teacher.CreatedAt,
                Status = "مكتمل",
                Type = "Teacher"
            });
        }

        // Get recent exams
        var recentExams = await _context.Exams
            .Include(e => e.Subject)
            .Where(e => !e.IsDeleted)
            .OrderByDescending(e => e.CreatedAt)
            .Take(2)
            .ToListAsync();

        foreach (var exam in recentExams)
        {
            recentActivities.Add(new RecentActivityDto
            {
                Id = exam.Id,
                Description = $"تم إنشاء امتحان {exam.Subject.Name}",
                UserName = "النظام",
                Date = exam.CreatedAt,
                Status = "مكتمل",
                Type = "Exam"
            });
        }
        
        return recentActivities
            .OrderByDescending(a => a.Date)
            .Take(10)
            .ToList();
    }

    public async Task<List<NotificationDto>> GetNotificationsAsync()
    {
        var notifications = new List<NotificationDto>();

        // Get upcoming exams (within next 7 days)
        var upcomingExams = await _context.Exams
            .Include(e => e.Subject)
            .Include(e => e.Class)
            .Where(e => e.ExamDate >= DateTime.UtcNow && 
                       e.ExamDate <= DateTime.UtcNow.AddDays(7) && 
                       !e.IsDeleted)
            .OrderBy(e => e.ExamDate)
            .Take(5)
            .ToListAsync();

        foreach (var exam in upcomingExams)
        {
            var daysUntil = (exam.ExamDate.Date - DateTime.UtcNow.Date).Days;
            var urgencyType = daysUntil <= 1 ? "warning" : "info";
            
            notifications.Add(new NotificationDto
            {
                Id = exam.Id,
                Title = $"امتحان {exam.Subject.Name}",
                Message = $"امتحان {exam.Subject.Name} للصف {exam.Class.Name} خلال {daysUntil} يوم",
                Date = exam.ExamDate,
                Type = urgencyType,
                IsRead = false
            });
        }

        // Get classes with low attendance (less than 80%)
        var classesWithLowAttendance = await _context.Classes
            .Include(c => c.Attendances)
            .Include(c => c.Students)
            .Where(c => !c.IsDeleted && c.Students.Any(s => !s.IsDeleted))
            .ToListAsync();

        foreach (var cls in classesWithLowAttendance)
        {
            var totalAttendanceRecords = cls.Attendances.Count(a => !a.IsDeleted);
            var presentRecords = cls.Attendances.Count(a => !a.IsDeleted && a.Status == Domain.Enums.AttendanceStatus.Present);
            
            if (totalAttendanceRecords > 0)
            {
                var attendanceRate = (double)presentRecords / totalAttendanceRecords * 100;
                if (attendanceRate < 80)
                {
                    notifications.Add(new NotificationDto
                    {
                        Id = cls.Id + 1000, // Offset to avoid ID conflicts
                        Title = "تنبيه: انخفاض نسبة الحضور",
                        Message = $"نسبة الحضور في {cls.Name} منخفضة ({attendanceRate:F1}%)",
                        Date = DateTime.UtcNow,
                        Type = "warning",
                        IsRead = false
                    });
                }
            }
        }

        // Get teachers with pending salary payments
        var pendingSalaries = await _context.Salaries
            .Include(s => s.Teacher)
            .ThenInclude(t => t.User)
            .Where(s => s.Status == Domain.Enums.SalaryStatus.Pending && !s.IsDeleted)
            .Take(3)
            .ToListAsync();

        foreach (var salary in pendingSalaries)
        {
            notifications.Add(new NotificationDto
            {
                Id = salary.Id + 2000, // Offset to avoid ID conflicts
                Title = "راتب معلق",
                Message = $"راتب {salary.Teacher.User.FullName} لشهر {salary.Month}/{salary.Year} معلق",
                Date = salary.CreatedAt,
                Type = "info",
                IsRead = false
            });
        }
        
        return notifications
            .OrderByDescending(n => n.Date)
            .Take(10)
            .ToList();
    }

    public async Task MarkNotificationAsReadAsync(int id)
    {
        // For exam notifications
        if (id < 1000)
        {
            var exam = await _context.Exams.FindAsync(id);
            if (exam != null)
            {
                // Mark as read in a notifications table if you have one
                // For now, we'll just simulate the operation
                await Task.CompletedTask;
            }
        }
        // For other notification types, implement similar logic
        await Task.CompletedTask;
    }
}