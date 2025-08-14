using SchoolManagement.Shared.DTOs.Attendance;
using SchoolManagement.Shared.DTOs.Common;

namespace SchoolManagement.Application.Interfaces;

public interface IAttendanceService
{
    Task<PagedResult<AttendanceDto>> GetAttendanceAsync(int pageNumber, int pageSize, DateTime? date = null, int? classId = null);
    Task<AttendanceDto?> GetAttendanceByIdAsync(int id);
    Task<AttendanceDto> CreateAttendanceAsync(CreateAttendanceDto createAttendanceDto);
    Task<AttendanceDto> UpdateAttendanceAsync(int id, CreateAttendanceDto updateAttendanceDto);
    Task<bool> DeleteAttendanceAsync(int id);
    Task<PagedResult<AttendanceDto>> GetStudentAttendanceAsync(int studentId, int pageNumber, int pageSize);
    Task<AttendanceReportDto> GetAttendanceReportsAsync(DateTime? startDate, DateTime? endDate, int? classId);
}