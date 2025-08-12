using SchoolManagement.Shared.DTOs.Common;
using SchoolManagement.Shared.DTOs.Subjects;

namespace SchoolManagement.Application.Interfaces;

public interface ISubjectService
{
    Task<PagedResult<SubjectDto>> GetAllSubjectsAsync(int pageNumber, int pageSize);
    Task<SubjectDto?> GetSubjectByIdAsync(int id);
    Task<SubjectDto> CreateSubjectAsync(CreateSubjectDto createSubjectDto);
    Task<SubjectDto> UpdateSubjectAsync(int id, CreateSubjectDto updateSubjectDto);
    Task<bool> DeleteSubjectAsync(int id);
}