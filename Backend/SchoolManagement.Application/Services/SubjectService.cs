using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SchoolManagement.Application.Interfaces;
using SchoolManagement.Domain.Entities;
using SchoolManagement.Infrastructure.Data;
using SchoolManagement.Shared.DTOs.Common;
using SchoolManagement.Shared.DTOs.Subjects;

namespace SchoolManagement.Application.Services;

public class SubjectService : ISubjectService
{
    private readonly SchoolDbContext _context;
    private readonly IMapper _mapper;

    public SubjectService(SchoolDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PagedResult<SubjectDto>> GetAllSubjectsAsync(int pageNumber, int pageSize)
    {
        var query = _context.Subjects
            .Where(s => !s.IsDeleted)
            .OrderBy(s => s.Name);

        var totalCount = await query.CountAsync();
        var subjects = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var subjectDtos = _mapper.Map<List<SubjectDto>>(subjects);

        return new PagedResult<SubjectDto>
        {
            Data = subjectDtos,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<SubjectDto?> GetSubjectByIdAsync(int id)
    {
        var subject = await _context.Subjects
            .FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);

        return subject != null ? _mapper.Map<SubjectDto>(subject) : null;
    }

    public async Task<SubjectDto> CreateSubjectAsync(CreateSubjectDto createSubjectDto)
    {
        var subject = new Subject
        {
            Name = createSubjectDto.Name,
            Code = createSubjectDto.Code,
            Description = createSubjectDto.Description,
            Credits = createSubjectDto.Credits,
            CreatedAt = DateTime.UtcNow
        };

        _context.Subjects.Add(subject);
        await _context.SaveChangesAsync();

        return await GetSubjectByIdAsync(subject.Id) ?? throw new Exception("Failed to create subject");
    }

    public async Task<SubjectDto> UpdateSubjectAsync(int id, CreateSubjectDto updateSubjectDto)
    {
        var subject = await _context.Subjects
            .FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);

        if (subject == null)
            throw new Exception("Subject not found");

        subject.Name = updateSubjectDto.Name;
        subject.Code = updateSubjectDto.Code;
        subject.Description = updateSubjectDto.Description;
        subject.Credits = updateSubjectDto.Credits;
        subject.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetSubjectByIdAsync(id) ?? throw new Exception("Failed to update subject");
    }

    public async Task<bool> DeleteSubjectAsync(int id)
    {
        var subject = await _context.Subjects
            .FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);

        if (subject == null)
            return false;

        subject.IsDeleted = true;
        subject.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }
}