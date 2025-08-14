using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SchoolManagement.Application.Interfaces;
using SchoolManagement.Domain.Entities;
using SchoolManagement.Infrastructure.Data;
using SchoolManagement.Shared.DTOs.Common;
using SchoolManagement.Shared.DTOs.Exams;

namespace SchoolManagement.Application.Services;

public class ExamService : IExamService
{
    private readonly SchoolDbContext _context;
    private readonly IMapper _mapper;

    public ExamService(SchoolDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PagedResult<ExamDto>> GetAllExamsAsync(int pageNumber, int pageSize)
    {
        var query = _context.Exams
            .Include(e => e.Class)
            .Include(e => e.Subject)
            .Where(e => !e.IsDeleted)
            .OrderByDescending(e => e.ExamDate);

        var totalCount = await query.CountAsync();
        var exams = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var examDtos = exams.Select(e => new ExamDto
        {
            Id = e.Id,
            Name = e.Name,
            Description = e.Description,
            ExamDate = e.ExamDate,
            Duration = e.Duration,
            TotalMarks = e.TotalMarks,
            PassingMarks = e.PassingMarks,
            Type = e.Type,
            ClassId = e.ClassId,
            ClassName = e.Class.Name,
            SubjectId = e.SubjectId,
            SubjectName = e.Subject.Name,
            CreatedAt = e.CreatedAt,
            UpdatedAt = e.UpdatedAt
        }).ToList();

        return new PagedResult<ExamDto>
        {
            Data = examDtos,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<ExamDto?> GetExamByIdAsync(int id)
    {
        var exam = await _context.Exams
            .Include(e => e.Class)
            .Include(e => e.Subject)
            .FirstOrDefaultAsync(e => e.Id == id && !e.IsDeleted);

        if (exam == null) return null;

        return new ExamDto
        {
            Id = exam.Id,
            Name = exam.Name,
            Description = exam.Description,
            ExamDate = exam.ExamDate,
            Duration = exam.Duration,
            TotalMarks = exam.TotalMarks,
            PassingMarks = exam.PassingMarks,
            Type = exam.Type,
            ClassId = exam.ClassId,
            ClassName = exam.Class.Name,
            SubjectId = exam.SubjectId,
            SubjectName = exam.Subject.Name,
            CreatedAt = exam.CreatedAt,
            UpdatedAt = exam.UpdatedAt
        };
    }

    public async Task<PagedResult<ExamDto>> GetExamsByClassIdAsync(int classId, int pageNumber, int pageSize)
    {
        var query = _context.Exams
            .Include(e => e.Class)
            .Include(e => e.Subject)
            .Where(e => e.ClassId == classId && !e.IsDeleted)
            .OrderByDescending(e => e.ExamDate);

        var totalCount = await query.CountAsync();
        var exams = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var examDtos = exams.Select(e => new ExamDto
        {
            Id = e.Id,
            Name = e.Name,
            Description = e.Description,
            ExamDate = e.ExamDate,
            Duration = e.Duration,
            TotalMarks = e.TotalMarks,
            PassingMarks = e.PassingMarks,
            Type = e.Type,
            ClassId = e.ClassId,
            ClassName = e.Class.Name,
            SubjectId = e.SubjectId,
            SubjectName = e.Subject.Name,
            CreatedAt = e.CreatedAt,
            UpdatedAt = e.UpdatedAt
        }).ToList();

        return new PagedResult<ExamDto>
        {
            Data = examDtos,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<PagedResult<ExamDto>> GetExamsByTeacherAsync(int teacherId, int pageNumber, int pageSize)
    {
        var query = _context.Exams
            .Include(e => e.Class)
            .Include(e => e.Subject)
            .Where(e => e.Class.ClassTeachers.Any(ct => ct.TeacherId == teacherId) && !e.IsDeleted)
            .OrderByDescending(e => e.ExamDate);

        var totalCount = await query.CountAsync();
        var exams = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var examDtos = exams.Select(e => new ExamDto
        {
            Id = e.Id,
            Name = e.Name,
            Description = e.Description,
            ExamDate = e.ExamDate,
            Duration = e.Duration,
            TotalMarks = e.TotalMarks,
            PassingMarks = e.PassingMarks,
            Type = e.Type,
            ClassId = e.ClassId,
            ClassName = e.Class.Name,
            SubjectId = e.SubjectId,
            SubjectName = e.Subject.Name,
            CreatedAt = e.CreatedAt,
            UpdatedAt = e.UpdatedAt
        }).ToList();

        return new PagedResult<ExamDto>
        {
            Data = examDtos,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<List<ExamDto>> GetUpcomingExamsForStudentAsync(int studentId)
    {
        var student = await _context.Students
            .Include(s => s.Class)
            .FirstOrDefaultAsync(s => s.Id == studentId);

        if (student == null) return new List<ExamDto>();

        var exams = await _context.Exams
            .Include(e => e.Class)
            .Include(e => e.Subject)
            .Where(e => e.ClassId == student.ClassId && 
                       e.ExamDate > DateTime.UtcNow && 
                       !e.IsDeleted)
            .OrderBy(e => e.ExamDate)
            .ToListAsync();

        return exams.Select(e => new ExamDto
        {
            Id = e.Id,
            Name = e.Name,
            Description = e.Description,
            ExamDate = e.ExamDate,
            Duration = e.Duration,
            TotalMarks = e.TotalMarks,
            PassingMarks = e.PassingMarks,
            Type = e.Type,
            ClassId = e.ClassId,
            ClassName = e.Class.Name,
            SubjectId = e.SubjectId,
            SubjectName = e.Subject.Name,
            CreatedAt = e.CreatedAt,
            UpdatedAt = e.UpdatedAt
        }).ToList();
    }

    public async Task<ExamDto> CreateExamAsync(CreateExamDto createExamDto)
    {
        var exam = new Exam
        {
            Name = createExamDto.Name,
            Description = createExamDto.Description,
            ExamDate = createExamDto.ExamDate,
            Duration = createExamDto.Duration,
            TotalMarks = createExamDto.TotalMarks,
            PassingMarks = createExamDto.PassingMarks,
            Type = createExamDto.Type,
            ClassId = createExamDto.ClassId,
            SubjectId = createExamDto.SubjectId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Exams.Add(exam);
        await _context.SaveChangesAsync();

        return await GetExamByIdAsync(exam.Id) ?? throw new Exception("Failed to create exam");
    }

    public async Task<ExamDto> UpdateExamAsync(int id, CreateExamDto updateExamDto)
    {
        var exam = await _context.Exams
            .FirstOrDefaultAsync(e => e.Id == id && !e.IsDeleted);

        if (exam == null)
            throw new Exception("Exam not found");

        exam.Name = updateExamDto.Name;
        exam.Description = updateExamDto.Description;
        exam.ExamDate = updateExamDto.ExamDate;
        exam.Duration = updateExamDto.Duration;
        exam.TotalMarks = updateExamDto.TotalMarks;
        exam.PassingMarks = updateExamDto.PassingMarks;
        exam.Type = updateExamDto.Type;
        exam.ClassId = updateExamDto.ClassId;
        exam.SubjectId = updateExamDto.SubjectId;
        exam.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetExamByIdAsync(id) ?? throw new Exception("Failed to update exam");
    }

    public async Task<bool> DeleteExamAsync(int id)
    {
        var exam = await _context.Exams
            .FirstOrDefaultAsync(e => e.Id == id && !e.IsDeleted);

        if (exam == null)
            return false;

        exam.IsDeleted = true;
        exam.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }
}