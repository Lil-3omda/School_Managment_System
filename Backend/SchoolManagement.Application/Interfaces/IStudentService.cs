using SchoolManagement.Shared.DTOs.Common;
using SchoolManagement.Shared.DTOs.Students;

namespace SchoolManagement.Application.Interfaces;

public interface IStudentService
{
    Task<PagedResult<StudentDto>> GetAllStudentsAsync(int pageNumber, int pageSize);
    Task<StudentDto?> GetStudentByIdAsync(int id);
    Task<StudentDto> CreateStudentAsync(CreateStudentDto createStudentDto);
    Task<StudentDto> UpdateStudentAsync(int id, CreateStudentDto updateStudentDto);
    Task<bool> DeleteStudentAsync(int id);
    Task<StudentDto?> GetStudentByUserIdAsync(int userId);
}