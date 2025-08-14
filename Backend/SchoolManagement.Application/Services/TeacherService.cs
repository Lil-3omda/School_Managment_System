using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SchoolManagement.Application.Interfaces;
using SchoolManagement.Domain.Entities;
using SchoolManagement.Domain.Enums;
using SchoolManagement.Infrastructure.Data;
using SchoolManagement.Shared.DTOs.Common;
using SchoolManagement.Shared.DTOs.Teachers;

namespace SchoolManagement.Application.Services;

public class TeacherService : ITeacherService
{
    private readonly SchoolDbContext _context;
    private readonly IMapper _mapper;

    public TeacherService(SchoolDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PagedResult<TeacherDto>> GetAllTeachersAsync(int pageNumber, int pageSize)
    {
        var query = _context.Teachers
            .Include(t => t.User)
            .Where(t => !t.IsDeleted)
            .OrderBy(t => t.User.FirstName);

        var totalCount = await query.CountAsync();
        var teachers = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var teacherDtos = _mapper.Map<List<TeacherDto>>(teachers);

        return new PagedResult<TeacherDto>
        {
            Data = teacherDtos,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<TeacherDto?> GetTeacherByIdAsync(int id)
    {
        var teacher = await _context.Teachers
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Id == id && !t.IsDeleted);

        return teacher != null ? _mapper.Map<TeacherDto>(teacher) : null;
    }

    public async Task<TeacherDto> CreateTeacherAsync(CreateTeacherDto createTeacherDto)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // Create User first
            var user = new User
            {
                FirstName = createTeacherDto.FirstName,
                LastName = createTeacherDto.LastName,
                Email = createTeacherDto.Email,
                PhoneNumber = createTeacherDto.PhoneNumber,
                DateOfBirth = createTeacherDto.DateOfBirth,
                Gender = createTeacherDto.Gender,
                Address = createTeacherDto.Address,
                Role = UserRole.Teacher,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), // Default password
                IsActive = true
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Create Teacher
            var teacher = new Teacher
            {
                UserId = user.Id,
                EmployeeNumber = createTeacherDto.EmployeeNumber,
                HireDate = createTeacherDto.HireDate,
                Qualification = createTeacherDto.Qualification,
                Specialization = createTeacherDto.Specialization,
                BaseSalary = createTeacherDto.BaseSalary,
                SalaryType = createTeacherDto.SalaryType,
                HourlyRate = createTeacherDto.HourlyRate
            };

            _context.Teachers.Add(teacher);
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            return await GetTeacherByIdAsync(teacher.Id) ?? throw new Exception("Failed to create teacher");
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<TeacherDto> UpdateTeacherAsync(int id, CreateTeacherDto updateTeacherDto)
    {
        var teacher = await _context.Teachers
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Id == id && !t.IsDeleted);

        if (teacher == null)
            throw new Exception("Teacher not found");

        // Update User
        teacher.User.FirstName = updateTeacherDto.FirstName;
        teacher.User.LastName = updateTeacherDto.LastName;
        teacher.User.Email = updateTeacherDto.Email;
        teacher.User.PhoneNumber = updateTeacherDto.PhoneNumber;
        teacher.User.DateOfBirth = updateTeacherDto.DateOfBirth;
        teacher.User.Gender = updateTeacherDto.Gender;
        teacher.User.Address = updateTeacherDto.Address;
        teacher.User.UpdatedAt = DateTime.UtcNow;

        // Update Teacher
        teacher.EmployeeNumber = updateTeacherDto.EmployeeNumber;
        teacher.HireDate = updateTeacherDto.HireDate;
        teacher.Qualification = updateTeacherDto.Qualification;
        teacher.Specialization = updateTeacherDto.Specialization;
        teacher.BaseSalary = updateTeacherDto.BaseSalary;
        teacher.SalaryType = updateTeacherDto.SalaryType;
        teacher.HourlyRate = updateTeacherDto.HourlyRate;
        teacher.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetTeacherByIdAsync(id) ?? throw new Exception("Failed to update teacher");
    }

    public async Task<bool> DeleteTeacherAsync(int id)
    {
        var teacher = await _context.Teachers
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Id == id && !t.IsDeleted);

        if (teacher == null)
            return false;

        teacher.IsDeleted = true;
        teacher.User.IsDeleted = true;
        teacher.UpdatedAt = DateTime.UtcNow;
        teacher.User.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<TeacherDto?> GetTeacherByUserIdAsync(int userId)
    {
        var teacher = await _context.Teachers
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.UserId == userId && !t.IsDeleted);

        return teacher != null ? _mapper.Map<TeacherDto>(teacher) : null;
    }
}