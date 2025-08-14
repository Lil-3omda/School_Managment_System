using SchoolManagement.Shared.DTOs.Common;
using SchoolManagement.Shared.DTOs.Exams;

namespace SchoolManagement.Application.Interfaces;

public interface IExamService
{
    Task<PagedResult<ExamDto>> GetAllExamsAsync(int pageNumber, int pageSize);
    Task<ExamDto?> GetExamByIdAsync(int id);
    Task<ExamDto> CreateExamAsync(CreateExamDto createExamDto);
    Task<ExamDto> UpdateExamAsync(int id, CreateExamDto updateExamDto);
    Task<bool> DeleteExamAsync(int id);
    Task<PagedResult<ExamDto>> GetExamsByClassIdAsync(int classId, int pageNumber, int pageSize);
    Task<PagedResult<ExamDto>> GetExamsByTeacherAsync(int teacherId, int pageNumber, int pageSize);
    Task<List<ExamDto>> GetUpcomingExamsForStudentAsync(int studentId);
}