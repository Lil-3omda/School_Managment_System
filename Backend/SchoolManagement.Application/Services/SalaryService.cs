using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SchoolManagement.Application.Interfaces;
using SchoolManagement.Domain.Entities;
using SchoolManagement.Infrastructure.Data;
using SchoolManagement.Shared.DTOs.Common;
using SchoolManagement.Shared.DTOs.Salaries;

namespace SchoolManagement.Application.Services;

public class SalaryService : ISalaryService
{
    private readonly SchoolDbContext _context;
    private readonly IMapper _mapper;

    public SalaryService(SchoolDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PagedResult<SalaryDto>> GetAllSalariesAsync(int pageNumber, int pageSize)
    {
        var query = _context.Salaries
            .Include(s => s.Teacher)
            .ThenInclude(t => t.User)
            .Where(s => !s.IsDeleted)
            .OrderByDescending(s => s.Year)
            .ThenByDescending(s => s.Month);

        var totalCount = await query.CountAsync();
        var salaries = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var salaryDtos = salaries.Select(s => new SalaryDto
        {
            Id = s.Id,
            TeacherId = s.TeacherId,
            TeacherName = s.Teacher.User.FullName,
            Month = s.Month,
            Year = s.Year,
            BaseSalary = s.BaseSalary,
            HoursWorked = s.HoursWorked,
            Bonus = s.Bonus,
            Deductions = s.Deductions,
            TotalSalary = s.TotalSalary,
            Status = s.Status,
            PaidDate = s.PaidDate,
            CreatedAt = s.CreatedAt,
            UpdatedAt = s.UpdatedAt
        }).ToList();

        return new PagedResult<SalaryDto>
        {
            Data = salaryDtos,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<SalaryDto?> GetSalaryByIdAsync(int id)
    {
        var salary = await _context.Salaries
            .Include(s => s.Teacher)
            .ThenInclude(t => t.User)
            .FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);

        if (salary == null) return null;

        return new SalaryDto
        {
            Id = salary.Id,
            TeacherId = salary.TeacherId,
            TeacherName = salary.Teacher.User.FullName,
            Month = salary.Month,
            Year = salary.Year,
            BaseSalary = salary.BaseSalary,
            HoursWorked = salary.HoursWorked,
            Bonus = salary.Bonus,
            Deductions = salary.Deductions,
            TotalSalary = salary.TotalSalary,
            Status = salary.Status,
            PaidDate = salary.PaidDate,
            CreatedAt = salary.CreatedAt,
            UpdatedAt = salary.UpdatedAt
        };
    }

    public async Task<PagedResult<SalaryDto>> GetTeacherSalariesAsync(int teacherId, int pageNumber, int pageSize)
    {
        var query = _context.Salaries
            .Include(s => s.Teacher)
            .ThenInclude(t => t.User)
            .Where(s => s.TeacherId == teacherId && !s.IsDeleted)
            .OrderByDescending(s => s.Year)
            .ThenByDescending(s => s.Month);

        var totalCount = await query.CountAsync();
        var salaries = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var salaryDtos = salaries.Select(s => new SalaryDto
        {
            Id = s.Id,
            TeacherId = s.TeacherId,
            TeacherName = s.Teacher.User.FullName,
            Month = s.Month,
            Year = s.Year,
            BaseSalary = s.BaseSalary,
            HoursWorked = s.HoursWorked,
            Bonus = s.Bonus,
            Deductions = s.Deductions,
            TotalSalary = s.TotalSalary,
            Status = s.Status,
            PaidDate = s.PaidDate,
            CreatedAt = s.CreatedAt,
            UpdatedAt = s.UpdatedAt
        }).ToList();

        return new PagedResult<SalaryDto>
        {
            Data = salaryDtos,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<SalaryDto> CreateSalaryAsync(CreateSalaryDto createSalaryDto)
    {
        var salary = new Salary
        {
            TeacherId = createSalaryDto.TeacherId,
            Month = createSalaryDto.Month,
            Year = createSalaryDto.Year,
            BaseSalary = createSalaryDto.BaseSalary,
            HoursWorked = createSalaryDto.HoursWorked,
            Bonus = createSalaryDto.Bonus,
            Deductions = createSalaryDto.Deductions,
            TotalSalary = createSalaryDto.TotalSalary,
            Status = createSalaryDto.Status,
            PaidDate = createSalaryDto.PaidDate,
            CreatedAt = DateTime.UtcNow
        };

        _context.Salaries.Add(salary);
        await _context.SaveChangesAsync();

        return await GetSalaryByIdAsync(salary.Id) ?? throw new Exception("Failed to create salary");
    }

    public async Task<SalaryDto> UpdateSalaryAsync(int id, CreateSalaryDto updateSalaryDto)
    {
        var salary = await _context.Salaries
            .FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);

        if (salary == null)
            throw new Exception("Salary not found");

        salary.TeacherId = updateSalaryDto.TeacherId;
        salary.Month = updateSalaryDto.Month;
        salary.Year = updateSalaryDto.Year;
        salary.BaseSalary = updateSalaryDto.BaseSalary;
        salary.HoursWorked = updateSalaryDto.HoursWorked;
        salary.Bonus = updateSalaryDto.Bonus;
        salary.Deductions = updateSalaryDto.Deductions;
        salary.TotalSalary = updateSalaryDto.TotalSalary;
        salary.Status = updateSalaryDto.Status;
        salary.PaidDate = updateSalaryDto.PaidDate;
        salary.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetSalaryByIdAsync(id) ?? throw new Exception("Failed to update salary");
    }

    public async Task<bool> DeleteSalaryAsync(int id)
    {
        var salary = await _context.Salaries
            .FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);

        if (salary == null)
            return false;

        salary.IsDeleted = true;
        salary.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }
}