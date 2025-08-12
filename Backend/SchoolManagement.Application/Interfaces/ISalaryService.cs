using SchoolManagement.Shared.DTOs.Common;
using SchoolManagement.Shared.DTOs.Salaries;

namespace SchoolManagement.Application.Interfaces;

public interface ISalaryService
{
    Task<PagedResult<SalaryDto>> GetAllSalariesAsync(int pageNumber, int pageSize);
    Task<SalaryDto?> GetSalaryByIdAsync(int id);
    Task<SalaryDto> CreateSalaryAsync(CreateSalaryDto createSalaryDto);
    Task<SalaryDto> UpdateSalaryAsync(int id, CreateSalaryDto updateSalaryDto);
    Task<bool> DeleteSalaryAsync(int id);
    Task<PagedResult<SalaryDto>> GetTeacherSalariesAsync(int teacherId, int pageNumber, int pageSize);
}