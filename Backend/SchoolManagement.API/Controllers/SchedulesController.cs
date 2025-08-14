using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Application.Interfaces;
using SchoolManagement.Shared.DTOs.Schedules;

namespace SchoolManagement.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class SchedulesController : ControllerBase
{
    private readonly IScheduleService _scheduleService;

    public SchedulesController(IScheduleService scheduleService)
    {
        _scheduleService = scheduleService;
    }

    [HttpGet("student/{studentId}")]
    [Authorize(Roles = "Student,Teacher,Admin")]
    public async Task<ActionResult<List<ScheduleDto>>> GetStudentSchedule(int studentId)
    {
        var schedule = await _scheduleService.GetStudentScheduleAsync(studentId);
        return Ok(schedule);
    }

    [HttpGet("teacher/{teacherId}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<ActionResult<List<ScheduleDto>>> GetTeacherSchedule(int teacherId)
    {
        var schedule = await _scheduleService.GetTeacherScheduleAsync(teacherId);
        return Ok(schedule);
    }

    [HttpGet("class/{classId}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<ActionResult<List<ScheduleDto>>> GetClassSchedule(int classId)
    {
        var schedule = await _scheduleService.GetClassScheduleAsync(classId);
        return Ok(schedule);
    }
}