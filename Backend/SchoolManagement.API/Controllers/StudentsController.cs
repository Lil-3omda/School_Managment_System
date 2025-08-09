using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Application.Interfaces;
using SchoolManagement.Shared.DTOs.Common;
using SchoolManagement.Shared.DTOs.Students;

namespace SchoolManagement.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class StudentsController : ControllerBase
{
    private readonly IStudentService _studentService;

    public StudentsController(IStudentService studentService)
    {
        _studentService = studentService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Teacher")]
    public async Task<ActionResult<PagedResult<StudentDto>>> GetStudents(
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10)
    {
        var result = await _studentService.GetAllStudentsAsync(pageNumber, pageSize);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<StudentDto>> GetStudent(int id)
    {
        var student = await _studentService.GetStudentByIdAsync(id);
        if (student == null)
        {
            return NotFound();
        }
        return Ok(student);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<StudentDto>> CreateStudent([FromBody] CreateStudentDto createStudentDto)
    {
        try
        {
            var student = await _studentService.CreateStudentAsync(createStudentDto);
            return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, student);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<StudentDto>> UpdateStudent(int id, [FromBody] CreateStudentDto updateStudentDto)
    {
        try
        {
            var student = await _studentService.UpdateStudentAsync(id, updateStudentDto);
            return Ok(student);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteStudent(int id)
    {
        var result = await _studentService.DeleteStudentAsync(id);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }
}