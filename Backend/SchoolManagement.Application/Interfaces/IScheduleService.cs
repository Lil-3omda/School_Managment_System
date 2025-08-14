using SchoolManagement.Shared.DTOs.Schedules;

namespace SchoolManagement.Application.Interfaces;

public interface IScheduleService
{
    Task<List<ScheduleDto>> GetStudentScheduleAsync(int studentId);
    Task<List<ScheduleDto>> GetTeacherScheduleAsync(int teacherId);
    Task<List<ScheduleDto>> GetClassScheduleAsync(int classId);
}