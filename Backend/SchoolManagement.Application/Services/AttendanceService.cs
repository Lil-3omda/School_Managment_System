using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SchoolManagement.Application.Interfaces;
using SchoolManagement.Domain.Entities;
using SchoolManagement.Domain.Enums;
using SchoolManagement.Infrastructure.Data;
using SchoolManagement.Shared.DTOs.Attendance;
using SchoolManagement.Shared.DTOs.Common;

namespace SchoolManagement.Application.Services;

public class AttendanceService : IAttendanceService
{
    private readonly SchoolDbContext _context;
    private readonly IMapper _mapper;

    public AttendanceService(SchoolDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PagedResult<AttendanceDto>> GetAttendanceAsync(int pageNumber, int pageSize, DateTime? date = null, int? classId = null)
    {
        var query = _context.Attendances
            .Include(a => a.Class)
            .Include(a => a.Student)
            .ThenInclude(s => s.User)
            .Include(a => a.Teacher)
            .ThenInclude(t => t.User)
            .Where(a => !a.IsDeleted);

        if (date.HasValue)
            query = query.Where(a => a.Date.Date == date.Value.Date);

        if (classId.HasValue)
            query = query.Where(a => a.ClassId == classId.Value);

        query = query.OrderByDescending(a => a.Date);

        var totalCount = await query.CountAsync();
        var attendances = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var attendanceDtos = attendances.Select(a => new AttendanceDto
        {
            Id = a.Id,
            Date = a.Date,
            ClassId = a.ClassId,
            ClassName = a.Class.Name,
            StudentId = a.StudentId,
            StudentName = a.Student?.User.FullName,
            TeacherId = a.TeacherId,
            TeacherName = a.Teacher?.User.FullName,
            Status = a.Status,
            Remarks = a.Remarks,
            CreatedAt = a.CreatedAt,
            UpdatedAt = a.UpdatedAt
        }).ToList();

        return new PagedResult<AttendanceDto>
        {
            Data = attendanceDtos,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<AttendanceDto?> GetAttendanceByIdAsync(int id)
    {
        var attendance = await _context.Attendances
            .Include(a => a.Class)
            .Include(a => a.Student)
            .ThenInclude(s => s.User)
            .Include(a => a.Teacher)
            .ThenInclude(t => t.User)
            .FirstOrDefaultAsync(a => a.Id == id && !a.IsDeleted);

        if (attendance == null) return null;

        return new AttendanceDto
        {
            Id = attendance.Id,
            Date = attendance.Date,
            ClassId = attendance.ClassId,
            ClassName = attendance.Class.Name,
            StudentId = attendance.StudentId,
            StudentName = attendance.Student?.User.FullName,
            TeacherId = attendance.TeacherId,
            TeacherName = attendance.Teacher?.User.FullName,
            Status = attendance.Status,
            Remarks = attendance.Remarks,
            CreatedAt = attendance.CreatedAt,
            UpdatedAt = attendance.UpdatedAt
        };
    }

    public async Task<PagedResult<AttendanceDto>> GetStudentAttendanceAsync(int studentId, int pageNumber, int pageSize)
    {
        var query = _context.Attendances
            .Include(a => a.Class)
            .Include(a => a.Student)
            .ThenInclude(s => s.User)
            .Where(a => a.StudentId == studentId && !a.IsDeleted)
            .OrderByDescending(a => a.Date);

        var totalCount = await query.CountAsync();
        var attendances = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var attendanceDtos = attendances.Select(a => new AttendanceDto
        {
            Id = a.Id,
            Date = a.Date,
            ClassId = a.ClassId,
            ClassName = a.Class.Name,
            StudentId = a.StudentId,
            StudentName = a.Student?.User.FullName,
            Status = a.Status,
            Remarks = a.Remarks,
            CreatedAt = a.CreatedAt,
            UpdatedAt = a.UpdatedAt
        }).ToList();

        return new PagedResult<AttendanceDto>
        {
            Data = attendanceDtos,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<AttendanceReportDto> GetAttendanceReportsAsync(DateTime? startDate, DateTime? endDate, int? classId)
    {
        var start = startDate ?? DateTime.UtcNow.AddMonths(-1);
        var end = endDate ?? DateTime.UtcNow;

        var query = _context.Attendances
            .Include(a => a.Class)
            .Include(a => a.Student)
            .ThenInclude(s => s.User)
            .Where(a => a.Date >= start && a.Date <= end && !a.IsDeleted);

        if (classId.HasValue)
            query = query.Where(a => a.ClassId == classId.Value);

        var attendances = await query.ToListAsync();

        var totalStudents = attendances.Select(a => a.StudentId).Distinct().Count();
        var totalDays = (end - start).Days + 1;
        var presentCount = attendances.Count(a => a.Status == AttendanceStatus.Present);
        var totalRecords = attendances.Count;

        var overallAttendanceRate = totalRecords > 0 ? (decimal)presentCount / totalRecords * 100 : 0;

        var classAttendance = attendances
            .GroupBy(a => new { a.ClassId, a.Class.Name })
            .Select(g => new ClassAttendanceDto
            {
                ClassId = g.Key.ClassId,
                ClassName = g.Key.Name,
                TotalStudents = g.Select(a => a.StudentId).Distinct().Count(),
                PresentDays = g.Count(a => a.Status == AttendanceStatus.Present),
                AbsentDays = g.Count(a => a.Status == AttendanceStatus.Absent),
                AttendanceRate = g.Count() > 0 ? (decimal)g.Count(a => a.Status == AttendanceStatus.Present) / g.Count() * 100 : 0
            }).ToList();

        var studentAttendance = attendances
            .Where(a => a.StudentId.HasValue)
            .GroupBy(a => new { a.StudentId, a.Student.User.FullName, a.Class.Name })
            .Select(g => new StudentAttendanceDto
            {
                StudentId = g.Key.StudentId!.Value,
                StudentName = g.Key.FullName,
                ClassName = g.Key.Name,
                PresentDays = g.Count(a => a.Status == AttendanceStatus.Present),
                AbsentDays = g.Count(a => a.Status == AttendanceStatus.Absent),
                LateDays = g.Count(a => a.Status == AttendanceStatus.Late),
                AttendanceRate = g.Count() > 0 ? (decimal)g.Count(a => a.Status == AttendanceStatus.Present) / g.Count() * 100 : 0
            }).ToList();

        return new AttendanceReportDto
        {
            StartDate = start,
            EndDate = end,
            TotalStudents = totalStudents,
            TotalDays = totalDays,
            OverallAttendanceRate = overallAttendanceRate,
            ClassAttendance = classAttendance,
            StudentAttendance = studentAttendance
        };
    }

    public async Task<AttendanceDto> CreateAttendanceAsync(CreateAttendanceDto createAttendanceDto)
    {
        var attendance = new Attendance
        {
            Date = createAttendanceDto.Date,
            ClassId = createAttendanceDto.ClassId,
            StudentId = createAttendanceDto.StudentId,
            TeacherId = createAttendanceDto.TeacherId,
            Status = createAttendanceDto.Status,
            Remarks = createAttendanceDto.Remarks,
            CreatedAt = DateTime.UtcNow
        };

        _context.Attendances.Add(attendance);
        await _context.SaveChangesAsync();

        return await GetAttendanceByIdAsync(attendance.Id) ?? throw new Exception("Failed to create attendance");
    }

    public async Task<AttendanceDto> UpdateAttendanceAsync(int id, CreateAttendanceDto updateAttendanceDto)
    {
        var attendance = await _context.Attendances
            .FirstOrDefaultAsync(a => a.Id == id && !a.IsDeleted);

        if (attendance == null)
            throw new Exception("Attendance not found");

        attendance.Date = updateAttendanceDto.Date;
        attendance.ClassId = updateAttendanceDto.ClassId;
        attendance.StudentId = updateAttendanceDto.StudentId;
        attendance.TeacherId = updateAttendanceDto.TeacherId;
        attendance.Status = updateAttendanceDto.Status;
        attendance.Remarks = updateAttendanceDto.Remarks;
        attendance.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetAttendanceByIdAsync(id) ?? throw new Exception("Failed to update attendance");
    }

    public async Task<bool> DeleteAttendanceAsync(int id)
    {
        var attendance = await _context.Attendances
            .FirstOrDefaultAsync(a => a.Id == id && !a.IsDeleted);

        if (attendance == null)
            return false;

        attendance.IsDeleted = true;
        attendance.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }
}