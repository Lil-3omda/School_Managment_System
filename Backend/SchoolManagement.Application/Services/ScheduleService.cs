using Microsoft.EntityFrameworkCore;
using SchoolManagement.Application.Interfaces;
using SchoolManagement.Infrastructure.Data;
using SchoolManagement.Shared.DTOs.Schedules;

namespace SchoolManagement.Application.Services;

public class ScheduleService : IScheduleService
{
    private readonly SchoolDbContext _context;

    public ScheduleService(SchoolDbContext context)
    {
        _context = context;
    }

    public async Task<List<ScheduleDto>> GetStudentScheduleAsync(int studentId)
    {
        var student = await _context.Students
            .Include(s => s.Class)
            .ThenInclude(c => c.ClassTeachers)
            .ThenInclude(ct => ct.Subject)
            .Include(s => s.Class)
            .ThenInclude(c => c.ClassTeachers)
            .ThenInclude(ct => ct.Teacher)
            .ThenInclude(t => t.User)
            .FirstOrDefaultAsync(s => s.Id == studentId);

        if (student == null) return new List<ScheduleDto>();

        // Mock schedule data - in real implementation, you would have a Schedule entity
        var schedules = new List<ScheduleDto>();
        var classTeachers = student.Class.ClassTeachers.Where(ct => !ct.IsDeleted).ToList();

        var days = new[] { "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس" };
        var timeSlots = new[]
        {
            new { Start = new TimeSpan(8, 0, 0), End = new TimeSpan(9, 0, 0) },
            new { Start = new TimeSpan(9, 15, 0), End = new TimeSpan(10, 15, 0) },
            new { Start = new TimeSpan(10, 30, 0), End = new TimeSpan(11, 30, 0) },
            new { Start = new TimeSpan(12, 0, 0), End = new TimeSpan(13, 0, 0) }
        };

        int scheduleId = 1;
        foreach (var day in days)
        {
            for (int i = 0; i < Math.Min(timeSlots.Length, classTeachers.Count); i++)
            {
                var classTeacher = classTeachers[i % classTeachers.Count];
                schedules.Add(new ScheduleDto
                {
                    Id = scheduleId++,
                    DayOfWeek = day,
                    StartTime = timeSlots[i].Start,
                    EndTime = timeSlots[i].End,
                    SubjectName = classTeacher.Subject.Name,
                    ClassName = student.Class.Name,
                    TeacherName = classTeacher.Teacher.User.FullName,
                    Room = student.Class.Room,
                    ClassId = student.ClassId,
                    SubjectId = classTeacher.SubjectId,
                    TeacherId = classTeacher.TeacherId
                });
            }
        }

        return schedules;
    }

    public async Task<List<ScheduleDto>> GetTeacherScheduleAsync(int teacherId)
    {
        var classTeachers = await _context.ClassTeachers
            .Include(ct => ct.Class)
            .Include(ct => ct.Subject)
            .Include(ct => ct.Teacher)
            .ThenInclude(t => t.User)
            .Where(ct => ct.TeacherId == teacherId && !ct.IsDeleted)
            .ToListAsync();

        // Mock schedule data
        var schedules = new List<ScheduleDto>();
        var days = new[] { "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس" };
        var timeSlots = new[]
        {
            new { Start = new TimeSpan(8, 0, 0), End = new TimeSpan(9, 0, 0) },
            new { Start = new TimeSpan(9, 15, 0), End = new TimeSpan(10, 15, 0) },
            new { Start = new TimeSpan(10, 30, 0), End = new TimeSpan(11, 30, 0) },
            new { Start = new TimeSpan(12, 0, 0), End = new TimeSpan(13, 0, 0) }
        };

        int scheduleId = 1;
        foreach (var day in days)
        {
            for (int i = 0; i < Math.Min(timeSlots.Length, classTeachers.Count); i++)
            {
                var classTeacher = classTeachers[i % classTeachers.Count];
                schedules.Add(new ScheduleDto
                {
                    Id = scheduleId++,
                    DayOfWeek = day,
                    StartTime = timeSlots[i].Start,
                    EndTime = timeSlots[i].End,
                    SubjectName = classTeacher.Subject.Name,
                    ClassName = classTeacher.Class.Name,
                    TeacherName = classTeacher.Teacher.User.FullName,
                    Room = classTeacher.Class.Room,
                    ClassId = classTeacher.ClassId,
                    SubjectId = classTeacher.SubjectId,
                    TeacherId = classTeacher.TeacherId
                });
            }
        }

        return schedules;
    }

    public async Task<List<ScheduleDto>> GetClassScheduleAsync(int classId)
    {
        var classTeachers = await _context.ClassTeachers
            .Include(ct => ct.Class)
            .Include(ct => ct.Subject)
            .Include(ct => ct.Teacher)
            .ThenInclude(t => t.User)
            .Where(ct => ct.ClassId == classId && !ct.IsDeleted)
            .ToListAsync();

        // Mock schedule data
        var schedules = new List<ScheduleDto>();
        var days = new[] { "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس" };
        var timeSlots = new[]
        {
            new { Start = new TimeSpan(8, 0, 0), End = new TimeSpan(9, 0, 0) },
            new { Start = new TimeSpan(9, 15, 0), End = new TimeSpan(10, 15, 0) },
            new { Start = new TimeSpan(10, 30, 0), End = new TimeSpan(11, 30, 0) },
            new { Start = new TimeSpan(12, 0, 0), End = new TimeSpan(13, 0, 0) }
        };

        int scheduleId = 1;
        foreach (var day in days)
        {
            for (int i = 0; i < Math.Min(timeSlots.Length, classTeachers.Count); i++)
            {
                var classTeacher = classTeachers[i % classTeachers.Count];
                schedules.Add(new ScheduleDto
                {
                    Id = scheduleId++,
                    DayOfWeek = day,
                    StartTime = timeSlots[i].Start,
                    EndTime = timeSlots[i].End,
                    SubjectName = classTeacher.Subject.Name,
                    ClassName = classTeacher.Class.Name,
                    TeacherName = classTeacher.Teacher.User.FullName,
                    Room = classTeacher.Class.Room,
                    ClassId = classTeacher.ClassId,
                    SubjectId = classTeacher.SubjectId,
                    TeacherId = classTeacher.TeacherId
                });
            }
        }

        return schedules;
    }
}