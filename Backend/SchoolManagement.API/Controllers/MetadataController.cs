using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Domain.Enums;

namespace SchoolManagement.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class MetadataController : ControllerBase
{
    [HttpGet("genders")]
    public ActionResult<IEnumerable<object>> GetGenders()
    {
        var items = Enum.GetValues(typeof(Gender))
            .Cast<Gender>()
            .Select(e => new { id = (int)e, name = e.ToString() });
        return Ok(items);
    }

    [HttpGet("salary-types")]
    public ActionResult<IEnumerable<object>> GetSalaryTypes()
    {
        var items = Enum.GetValues(typeof(SalaryType))
            .Cast<SalaryType>()
            .Select(e => new { id = (int)e, name = e.ToString() });
        return Ok(items);
    }

    [HttpGet("attendance-statuses")]
    public ActionResult<IEnumerable<object>> GetAttendanceStatuses()
    {
        var items = Enum.GetValues(typeof(AttendanceStatus))
            .Cast<AttendanceStatus>()
            .Select(e => new { id = (int)e, name = e.ToString() });
        return Ok(items);
    }

    [HttpGet("salary-statuses")]
    public ActionResult<IEnumerable<object>> GetSalaryStatuses()
    {
        var items = Enum.GetValues(typeof(SalaryStatus))
            .Cast<SalaryStatus>()
            .Select(e => new { id = (int)e, name = e.ToString() });
        return Ok(items);
    }

    [HttpGet("exam-types")]
    public ActionResult<IEnumerable<object>> GetExamTypes()
    {
        var items = Enum.GetValues(typeof(ExamType))
            .Cast<ExamType>()
            .Select(e => new { id = (int)e, name = e.ToString() });
        return Ok(items);
    }
}

