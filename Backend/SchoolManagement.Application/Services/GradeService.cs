using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SchoolManagement.Application.Interfaces;
using SchoolManagement.Domain.Entities;
using SchoolManagement.Infrastructure.Data;
using SchoolManagement.Shared.DTOs.Common;
using SchoolManagement.Shared.DTOs.Grades;

namespace SchoolManagement.Application.Services;

public class GradeService : IGradeService
{
    private readonly SchoolDbContext _context;
    private readonly IMapper _mapper;

    public GradeService(SchoolDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PagedResult<GradeDto>> GetGradesByStudentAsync(int studentId, int pageNumber, int pageSize)
    {
        var query = _context.Grades
            .Include(g => g.Student)
            .ThenInclude(s => s.User)
            .Include(g => g.Exam)
            .ThenInclude(e => e.Subject)
            .Where(g => g.StudentId == studentId && !g.IsDeleted)
            .OrderByDescending(g => g.Exam.ExamDate);

        var totalCount = await query.CountAsync();
        var grades = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var gradeDtos = grades.Select(g => new GradeDto
        {
            Id = g.Id,
            StudentId = g.StudentId,
            StudentName = g.Student.User.FullName,
            ExamId = g.ExamId,
            ExamName = g.Exam.Name,
            SubjectName = g.Exam.Subject.Name,
            MarksObtained = g.MarksObtained,
            TotalMarks = g.Exam.TotalMarks,
            GradeValue = g.GradeValue,
            IsPassed = g.IsPassed,
            Remarks = g.Remarks,
            ExamDate = g.Exam.ExamDate,
            CreatedAt = g.CreatedAt,
            UpdatedAt = g.UpdatedAt
        }).ToList();

        return new PagedResult<GradeDto>
        {
            Data = gradeDtos,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<PagedResult<GradeDto>> GetGradesByExamAsync(int examId, int pageNumber, int pageSize)
    {
        var query = _context.Grades
            .Include(g => g.Student)
            .ThenInclude(s => s.User)
            .Include(g => g.Exam)
            .ThenInclude(e => e.Subject)
            .Where(g => g.ExamId == examId && !g.IsDeleted)
            .OrderBy(g => g.Student.User.FirstName);

        var totalCount = await query.CountAsync();
        var grades = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var gradeDtos = grades.Select(g => new GradeDto
        {
            Id = g.Id,
            StudentId = g.StudentId,
            StudentName = g.Student.User.FullName,
            ExamId = g.ExamId,
            ExamName = g.Exam.Name,
            SubjectName = g.Exam.Subject.Name,
            MarksObtained = g.MarksObtained,
            TotalMarks = g.Exam.TotalMarks,
            GradeValue = g.GradeValue,
            IsPassed = g.IsPassed,
            Remarks = g.Remarks,
            ExamDate = g.Exam.ExamDate,
            CreatedAt = g.CreatedAt,
            UpdatedAt = g.UpdatedAt
        }).ToList();

        return new PagedResult<GradeDto>
        {
            Data = gradeDtos,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<GradeDto?> GetGradeByIdAsync(int id)
    {
        var grade = await _context.Grades
            .Include(g => g.Student)
            .ThenInclude(s => s.User)
            .Include(g => g.Exam)
            .ThenInclude(e => e.Subject)
            .FirstOrDefaultAsync(g => g.Id == id && !g.IsDeleted);

        if (grade == null) return null;

        return new GradeDto
        {
            Id = grade.Id,
            StudentId = grade.StudentId,
            StudentName = grade.Student.User.FullName,
            ExamId = grade.ExamId,
            ExamName = grade.Exam.Name,
            SubjectName = grade.Exam.Subject.Name,
            MarksObtained = grade.MarksObtained,
            TotalMarks = grade.Exam.TotalMarks,
            GradeValue = grade.GradeValue,
            IsPassed = grade.IsPassed,
            Remarks = grade.Remarks,
            ExamDate = grade.Exam.ExamDate,
            CreatedAt = grade.CreatedAt,
            UpdatedAt = grade.UpdatedAt
        };
    }

    public async Task<GradeDto> CreateGradeAsync(CreateGradeDto createGradeDto)
    {
        var grade = new Grade
        {
            StudentId = createGradeDto.StudentId,
            ExamId = createGradeDto.ExamId,
            MarksObtained = createGradeDto.MarksObtained,
            GradeValue = createGradeDto.GradeValue,
            IsPassed = createGradeDto.IsPassed,
            Remarks = createGradeDto.Remarks,
            CreatedAt = DateTime.UtcNow
        };

        _context.Grades.Add(grade);
        await _context.SaveChangesAsync();

        return await GetGradeByIdAsync(grade.Id) ?? throw new Exception("Failed to create grade");
    }

    public async Task<GradeDto> UpdateGradeAsync(int id, CreateGradeDto updateGradeDto)
    {
        var grade = await _context.Grades
            .FirstOrDefaultAsync(g => g.Id == id && !g.IsDeleted);

        if (grade == null)
            throw new Exception("Grade not found");

        grade.StudentId = updateGradeDto.StudentId;
        grade.ExamId = updateGradeDto.ExamId;
        grade.MarksObtained = updateGradeDto.MarksObtained;
        grade.GradeValue = updateGradeDto.GradeValue;
        grade.IsPassed = updateGradeDto.IsPassed;
        grade.Remarks = updateGradeDto.Remarks;
        grade.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetGradeByIdAsync(id) ?? throw new Exception("Failed to update grade");
    }

    public async Task<bool> DeleteGradeAsync(int id)
    {
        var grade = await _context.Grades
            .FirstOrDefaultAsync(g => g.Id == id && !g.IsDeleted);

        if (grade == null)
            return false;

        grade.IsDeleted = true;
        grade.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }
}