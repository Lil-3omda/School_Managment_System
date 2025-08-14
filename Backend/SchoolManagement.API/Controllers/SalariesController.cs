using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Application.Interfaces;
using SchoolManagement.Shared.DTOs.Common;
using SchoolManagement.Shared.DTOs.Salaries;

namespace SchoolManagement.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class SalariesController : ControllerBase
{
    private readonly ISalaryService _salaryService;

    public SalariesController(ISalaryService salaryService)
    {
        _salaryService = salaryService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<PagedResult<SalaryDto>>> GetSalaries(
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10)
    {
        var result = await _salaryService.GetAllSalariesAsync(pageNumber, pageSize);
        return Ok(result);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<SalaryDto>> GetSalary(int id)
    {
        var salary = await _salaryService.GetSalaryByIdAsync(id);
        if (salary == null)
        {
            return NotFound();
        }
        return Ok(salary);
    }

    [HttpGet("teacher/{teacherId}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<ActionResult<PagedResult<SalaryDto>>> GetTeacherSalaries(int teacherId,
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10)
    {
        var result = await _salaryService.GetTeacherSalariesAsync(teacherId, pageNumber, pageSize);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<SalaryDto>> CreateSalary([FromBody] CreateSalaryDto createSalaryDto)
    {
        try
        {
            var salary = await _salaryService.CreateSalaryAsync(createSalaryDto);
            return Ok(salary);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<SalaryDto>> UpdateSalary(int id, [FromBody] CreateSalaryDto updateSalaryDto)
    {
        try
        {
            var salary = await _salaryService.UpdateSalaryAsync(id, updateSalaryDto);
            return Ok(salary);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteSalary(int id)
    {
        var result = await _salaryService.DeleteSalaryAsync(id);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }
}