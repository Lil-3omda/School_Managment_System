using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Application.Interfaces;
using SchoolManagement.Shared.DTOs.Classes;
using SchoolManagement.Shared.DTOs.Common;

namespace SchoolManagement.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class ClassesController : ControllerBase
{
    private readonly IClassService _classService;

    public ClassesController(IClassService classService)
    {
        _classService = classService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Teacher")]
    public async Task<ActionResult<PagedResult<ClassDto>>> GetClasses(
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10)
    {
        var result = await _classService.GetAllClassesAsync(pageNumber, pageSize);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ClassDto>> GetClass(int id)
    {
        var classDto = await _classService.GetClassByIdAsync(id);
        if (classDto == null)
        {
            return NotFound();
        }
        return Ok(classDto);
    }

    [HttpGet("teacher/{teacherId}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<ActionResult<List<ClassDto>>> GetClassesByTeacher(int teacherId)
    {
        var classes = await _classService.GetClassesByTeacherAsync(teacherId);
        return Ok(classes);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ClassDto>> CreateClass([FromBody] CreateClassDto createClassDto)
    {
        try
        {
            var classDto = await _classService.CreateClassAsync(createClassDto);
            return CreatedAtAction(nameof(GetClass), new { id = classDto.Id }, classDto);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ClassDto>> UpdateClass(int id, [FromBody] CreateClassDto updateClassDto)
    {
        try
        {
            var classDto = await _classService.UpdateClassAsync(id, updateClassDto);
            return Ok(classDto);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteClass(int id)
    {
        var result = await _classService.DeleteClassAsync(id);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }
}