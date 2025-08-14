using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SchoolManagement.Application.Interfaces;
using SchoolManagement.Domain.Entities;
using SchoolManagement.Infrastructure.Data;
using SchoolManagement.Shared.DTOs.Classes;
using SchoolManagement.Shared.DTOs.Common;

namespace SchoolManagement.Application.Services;

public class ClassService : IClassService
{
    private readonly SchoolDbContext _context;
    private readonly IMapper _mapper;

    public ClassService(SchoolDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PagedResult<ClassDto>> GetAllClassesAsync(int pageNumber, int pageSize)
    {
        var query = _context.Classes
            .Include(c => c.Students)
            .Where(c => !c.IsDeleted)
            .OrderBy(c => c.Name);

        var totalCount = await query.CountAsync();
        var classes = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var classDtos = classes.Select(c => new ClassDto
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            Capacity = c.Capacity,
            Room = c.Room,
            StartTime = c.StartTime,
            EndTime = c.EndTime,
            StudentCount = c.Students.Count(s => !s.IsDeleted),
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt
        }).ToList();

        return new PagedResult<ClassDto>
        {
            Data = classDtos,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<ClassDto?> GetClassByIdAsync(int id)
    {
        var classEntity = await _context.Classes
            .Include(c => c.Students)
            .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);

        if (classEntity == null) return null;

        return new ClassDto
        {
            Id = classEntity.Id,
            Name = classEntity.Name,
            Description = classEntity.Description,
            Capacity = classEntity.Capacity,
            Room = classEntity.Room,
            StartTime = classEntity.StartTime,
            EndTime = classEntity.EndTime,
            StudentCount = classEntity.Students.Count(s => !s.IsDeleted),
            CreatedAt = classEntity.CreatedAt,
            UpdatedAt = classEntity.UpdatedAt
        };
    }

    public async Task<List<ClassDto>> GetClassesByTeacherAsync(int teacherId)
    {
        var classes = await _context.ClassTeachers
            .Include(ct => ct.Class)
            .ThenInclude(c => c.Students)
            .Where(ct => ct.TeacherId == teacherId && !ct.IsDeleted && !ct.Class.IsDeleted)
            .Select(ct => ct.Class)
            .Distinct()
            .ToListAsync();

        return classes.Select(c => new ClassDto
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            Capacity = c.Capacity,
            Room = c.Room,
            StartTime = c.StartTime,
            EndTime = c.EndTime,
            StudentCount = c.Students.Count(s => !s.IsDeleted),
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt
        }).ToList();
    }

    public async Task<ClassDto> CreateClassAsync(CreateClassDto createClassDto)
    {
        var classEntity = new Class
        {
            Name = createClassDto.Name,
            Description = createClassDto.Description,
            Capacity = createClassDto.Capacity,
            Room = createClassDto.Room,
            StartTime = createClassDto.StartTime,
            EndTime = createClassDto.EndTime,
            CreatedAt = DateTime.UtcNow
        };

        _context.Classes.Add(classEntity);
        await _context.SaveChangesAsync();

        return await GetClassByIdAsync(classEntity.Id) ?? throw new Exception("Failed to create class");
    }

    public async Task<ClassDto> UpdateClassAsync(int id, CreateClassDto updateClassDto)
    {
        var classEntity = await _context.Classes
            .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);

        if (classEntity == null)
            throw new Exception("Class not found");

        classEntity.Name = updateClassDto.Name;
        classEntity.Description = updateClassDto.Description;
        classEntity.Capacity = updateClassDto.Capacity;
        classEntity.Room = updateClassDto.Room;
        classEntity.StartTime = updateClassDto.StartTime;
        classEntity.EndTime = updateClassDto.EndTime;
        classEntity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetClassByIdAsync(id) ?? throw new Exception("Failed to update class");
    }

    public async Task<bool> DeleteClassAsync(int id)
    {
        var classEntity = await _context.Classes
            .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);

        if (classEntity == null)
            return false;

        classEntity.IsDeleted = true;
        classEntity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }
}