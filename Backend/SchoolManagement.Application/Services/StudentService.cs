using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SchoolManagement.Application.Interfaces;
using SchoolManagement.Domain.Entities;
using SchoolManagement.Domain.Enums;
using SchoolManagement.Infrastructure.Data;
using SchoolManagement.Shared.DTOs.Common;
using SchoolManagement.Shared.DTOs.Students;

namespace SchoolManagement.Application.Services;

public class StudentService : IStudentService
{
    private readonly SchoolDbContext _context;
    private readonly IMapper _mapper;

    public StudentService(SchoolDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PagedResult<StudentDto>> GetAllStudentsAsync(int pageNumber, int pageSize)
    {
        var query = _context.Students
            .Include(s => s.User)
            .Include(s => s.Class)
            .Where(s => !s.IsDeleted)
            .OrderBy(s => s.User.FirstName);

        var totalCount = await query.CountAsync();
        var students = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var studentDtos = _mapper.Map<List<StudentDto>>(students);

        return new PagedResult<StudentDto>
        {
            Data = studentDtos,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<StudentDto?> GetStudentByIdAsync(int id)
    {
        var student = await _context.Students
            .Include(s => s.User)
            .Include(s => s.Class)
            .FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);

        return student != null ? _mapper.Map<StudentDto>(student) : null;
    }

    public async Task<StudentDto> CreateStudentAsync(CreateStudentDto createStudentDto)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // Create User first
            var user = new User
            {
                FirstName = createStudentDto.FirstName,
                LastName = createStudentDto.LastName,
                Email = createStudentDto.Email,
                PhoneNumber = createStudentDto.PhoneNumber,
                DateOfBirth = createStudentDto.DateOfBirth,
                Gender = createStudentDto.Gender,
                Address = createStudentDto.Address,
                Role = UserRole.Student,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), // Default password
                IsActive = true
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Create Student
            var student = new Student
            {
                UserId = user.Id,
                StudentNumber = createStudentDto.StudentNumber,
                EnrollmentDate = createStudentDto.EnrollmentDate,
                ClassId = createStudentDto.ClassId,
                GuardianName = createStudentDto.GuardianName,
                GuardianPhone = createStudentDto.GuardianPhone,
                GuardianEmail = createStudentDto.GuardianEmail
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            return await GetStudentByIdAsync(student.Id) ?? throw new Exception("Failed to create student");
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<StudentDto> UpdateStudentAsync(int id, CreateStudentDto updateStudentDto)
    {
        var student = await _context.Students
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);

        if (student == null)
            throw new Exception("Student not found");

        // Update User
        student.User.FirstName = updateStudentDto.FirstName;
        student.User.LastName = updateStudentDto.LastName;
        student.User.Email = updateStudentDto.Email;
        student.User.PhoneNumber = updateStudentDto.PhoneNumber;
        student.User.DateOfBirth = updateStudentDto.DateOfBirth;
        student.User.Gender = updateStudentDto.Gender;
        student.User.Address = updateStudentDto.Address;
        student.User.UpdatedAt = DateTime.UtcNow;

        // Update Student
        student.StudentNumber = updateStudentDto.StudentNumber;
        student.EnrollmentDate = updateStudentDto.EnrollmentDate;
        student.ClassId = updateStudentDto.ClassId;
        student.GuardianName = updateStudentDto.GuardianName;
        student.GuardianPhone = updateStudentDto.GuardianPhone;
        student.GuardianEmail = updateStudentDto.GuardianEmail;
        student.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetStudentByIdAsync(id) ?? throw new Exception("Failed to update student");
    }

    public async Task<bool> DeleteStudentAsync(int id)
    {
        var student = await _context.Students
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);

        if (student == null)
            return false;

        student.IsDeleted = true;
        student.User.IsDeleted = true;
        student.UpdatedAt = DateTime.UtcNow;
        student.User.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<StudentDto?> GetStudentByUserIdAsync(int userId)
    {
        var student = await _context.Students
            .Include(s => s.User)
            .Include(s => s.Class)
            .FirstOrDefaultAsync(s => s.UserId == userId && !s.IsDeleted);

        return student != null ? _mapper.Map<StudentDto>(student) : null;
    }
}