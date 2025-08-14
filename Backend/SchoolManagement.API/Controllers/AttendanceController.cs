using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Application.Interfaces;
using SchoolManagement.Shared.DTOs.Attendance;
using SchoolManagement.Shared.DTOs.Common;

namespace SchoolManagement.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class AttendanceController : ControllerBase
{
    private readonly IAttendanceService _attendanceService;

    public AttendanceController(IAttendanceService attendanceService)
    {
        _attendanceService = attendanceService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Teacher")]
    public async Task<ActionResult<PagedResult<AttendanceDto>>> GetAttendance(
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10,
        [FromQuery] DateTime? date = null,
        [FromQuery] int? classId = null)
    {
        var result = await _attendanceService.GetAttendanceAsync(pageNumber, pageSize, date, classId);
        return Ok(result);
    }

    [HttpGet("student/{studentId}")]
    [Authorize(Roles = "Student,Teacher,Admin")]
    public async Task<ActionResult<PagedResult<AttendanceDto>>> GetStudentAttendance(int studentId,
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10)
    {
        var result = await _attendanceService.GetStudentAttendanceAsync(studentId, pageNumber, pageSize);
        return Ok(result);
    }

    [HttpGet("reports")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<AttendanceReportDto>> GetAttendanceReports(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] int? classId = null)
    {
        var result = await _attendanceService.GetAttendanceReportsAsync(startDate, endDate, classId);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<ActionResult<AttendanceDto>> CreateAttendance([FromBody] CreateAttendanceDto createAttendanceDto)
    {
        try
        {
            var attendance = await _attendanceService.CreateAttendanceAsync(createAttendanceDto);
            return Ok(attendance);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<ActionResult<AttendanceDto>> UpdateAttendance(int id, [FromBody] CreateAttendanceDto updateAttendanceDto)
    {
        try
        {
            var attendance = await _attendanceService.UpdateAttendanceAsync(id, updateAttendanceDto);
            return Ok(attendance);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteAttendance(int id)
    {
        var result = await _attendanceService.DeleteAttendanceAsync(id);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }
}