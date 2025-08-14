using SchoolManagement.Shared.DTOs.Classes;
using SchoolManagement.Shared.DTOs.Common;

namespace SchoolManagement.Application.Interfaces;

public interface IClassService
{
    Task<PagedResult<ClassDto>> GetAllClassesAsync(int pageNumber, int pageSize);
    Task<ClassDto?> GetClassByIdAsync(int id);
    Task<ClassDto> CreateClassAsync(CreateClassDto createClassDto);
    Task<ClassDto> UpdateClassAsync(int id, CreateClassDto updateClassDto);
    Task<bool> DeleteClassAsync(int id);
    Task<List<ClassDto>> GetClassesByTeacherAsync(int teacherId);
}