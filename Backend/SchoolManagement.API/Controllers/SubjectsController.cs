using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Application.Interfaces;
using SchoolManagement.Shared.DTOs.Common;
using SchoolManagement.Shared.DTOs.Subjects;

namespace SchoolManagement.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class SubjectsController : ControllerBase
{
    private readonly ISubjectService _subjectService;

    public SubjectsController(ISubjectService subjectService)
    {
        _subjectService = subjectService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<SubjectDto>>> GetSubjects(
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10)
    {
        var result = await _subjectService.GetAllSubjectsAsync(pageNumber, pageSize);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SubjectDto>> GetSubject(int id)
    {
        var subject = await _subjectService.GetSubjectByIdAsync(id);
        if (subject == null)
        {
            return NotFound();
        }
        return Ok(subject);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<SubjectDto>> CreateSubject([FromBody] CreateSubjectDto createSubjectDto)
    {
        try
        {
            var subject = await _subjectService.CreateSubjectAsync(createSubjectDto);
            return CreatedAtAction(nameof(GetSubject), new { id = subject.Id }, subject);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<SubjectDto>> UpdateSubject(int id, [FromBody] CreateSubjectDto updateSubjectDto)
    {
        try
        {
            var subject = await _subjectService.UpdateSubjectAsync(id, updateSubjectDto);
            return Ok(subject);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteSubject(int id)
    {
        var result = await _subjectService.DeleteSubjectAsync(id);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }
}