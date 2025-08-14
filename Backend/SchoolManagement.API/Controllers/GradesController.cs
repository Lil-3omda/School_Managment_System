using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Application.Interfaces;
using SchoolManagement.Shared.DTOs.Common;
using SchoolManagement.Shared.DTOs.Grades;

namespace SchoolManagement.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class GradesController : ControllerBase
{
    private readonly IGradeService _gradeService;

    public GradesController(IGradeService gradeService)
    {
        _gradeService = gradeService;
    }

    [HttpGet("student/{studentId}")]
    [Authorize(Roles = "Student,Teacher,Admin")]
    public async Task<ActionResult<PagedResult<GradeDto>>> GetGradesByStudent(int studentId,
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10)
    {
        var result = await _gradeService.GetGradesByStudentAsync(studentId, pageNumber, pageSize);
        return Ok(result);
    }

    [HttpGet("exam/{examId}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<ActionResult<PagedResult<GradeDto>>> GetGradesByExam(int examId,
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10)
    {
        var result = await _gradeService.GetGradesByExamAsync(examId, pageNumber, pageSize);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<ActionResult<GradeDto>> CreateGrade([FromBody] CreateGradeDto createGradeDto)
    {
        try
        {
            var grade = await _gradeService.CreateGradeAsync(createGradeDto);
            return Ok(grade);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<ActionResult<GradeDto>> UpdateGrade(int id, [FromBody] CreateGradeDto updateGradeDto)
    {
        try
        {
            var grade = await _gradeService.UpdateGradeAsync(id, updateGradeDto);
            return Ok(grade);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteGrade(int id)
    {
        var result = await _gradeService.DeleteGradeAsync(id);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }
}