using SchoolManagement.Shared.DTOs.Common;
using SchoolManagement.Shared.DTOs.Grades;

namespace SchoolManagement.Application.Interfaces;

public interface IGradeService
{
    Task<PagedResult<GradeDto>> GetGradesByStudentAsync(int studentId, int pageNumber, int pageSize);
    Task<PagedResult<GradeDto>> GetGradesByExamAsync(int examId, int pageNumber, int pageSize);
    Task<GradeDto?> GetGradeByIdAsync(int id);
    Task<GradeDto> CreateGradeAsync(CreateGradeDto createGradeDto);
    Task<GradeDto> UpdateGradeAsync(int id, CreateGradeDto updateGradeDto);
    Task<bool> DeleteGradeAsync(int id);
}