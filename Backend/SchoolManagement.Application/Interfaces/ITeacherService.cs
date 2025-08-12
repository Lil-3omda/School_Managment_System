using SchoolManagement.Shared.DTOs.Common;
using SchoolManagement.Shared.DTOs.Teachers;

namespace SchoolManagement.Application.Interfaces;

public interface ITeacherService
{
    Task<PagedResult<TeacherDto>> GetAllTeachersAsync(int pageNumber, int pageSize);
    Task<TeacherDto?> GetTeacherByIdAsync(int id);
    Task<TeacherDto> CreateTeacherAsync(CreateTeacherDto createTeacherDto);
    Task<TeacherDto> UpdateTeacherAsync(int id, CreateTeacherDto updateTeacherDto);
    Task<bool> DeleteTeacherAsync(int id);
    Task<TeacherDto?> GetTeacherByUserIdAsync(int userId);
}