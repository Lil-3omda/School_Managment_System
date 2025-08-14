using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Application.Interfaces;
using SchoolManagement.Shared.DTOs.Common;
using SchoolManagement.Shared.DTOs.Exams;

namespace SchoolManagement.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class ExamsController : ControllerBase
{
    private readonly IExamService _examService;

    public ExamsController(IExamService examService)
    {
        _examService = examService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Teacher")]
    public async Task<ActionResult<PagedResult<ExamDto>>> GetExams(
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10)
    {
        var result = await _examService.GetAllExamsAsync(pageNumber, pageSize);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ExamDto>> GetExam(int id)
    {
        var exam = await _examService.GetExamByIdAsync(id);
        if (exam == null)
        {
            return NotFound();
        }
        return Ok(exam);
    }

    [HttpGet("teacher/{teacherId}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<ActionResult<PagedResult<ExamDto>>> GetExamsByTeacher(int teacherId, 
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10)
    {
        var result = await _examService.GetExamsByTeacherAsync(teacherId, pageNumber, pageSize);
        return Ok(result);
    }

    [HttpGet("upcoming/student/{studentId}")]
    [Authorize(Roles = "Student,Admin")]
    public async Task<ActionResult<List<ExamDto>>> GetUpcomingExamsForStudent(int studentId)
    {
        var exams = await _examService.GetUpcomingExamsForStudentAsync(studentId);
        return Ok(exams);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Teacher")]
    public async Task<ActionResult<ExamDto>> CreateExam([FromBody] CreateExamDto createExamDto)
    {
        try
        {
            var exam = await _examService.CreateExamAsync(createExamDto);
            return CreatedAtAction(nameof(GetExam), new { id = exam.Id }, exam);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Teacher")]
    public async Task<ActionResult<ExamDto>> UpdateExam(int id, [FromBody] CreateExamDto updateExamDto)
    {
        try
        {
            var exam = await _examService.UpdateExamAsync(id, updateExamDto);
            return Ok(exam);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteExam(int id)
    {
        var result = await _examService.DeleteExamAsync(id);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }
}