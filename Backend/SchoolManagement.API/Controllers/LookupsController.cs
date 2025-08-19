using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Shared.DTOs.Common;
using SchoolManagement.Domain.Enums;

namespace SchoolManagement.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class LookupsController : ControllerBase
{
    [HttpGet("genders")]
    public ActionResult<IEnumerable<LookupItemDto>> GetGenders()
    {
        var items = new List<LookupItemDto>
        {
            new() { Id = (int)Gender.Male, Name = "ذكر" },
            new() { Id = (int)Gender.Female, Name = "أنثى" }
        };
        return Ok(items);
    }

    [HttpGet("exam-types")]
    public ActionResult<IEnumerable<LookupItemDto>> GetExamTypes()
    {
        var items = Enum.GetValues(typeof(ExamType))
            .Cast<ExamType>()
            .Select(e => new LookupItemDto
            {
                Id = (int)e,
                Name = e switch
                {
                    ExamType.Quiz => "اختبار قصير",
                    ExamType.MidTerm => "امتحان نصفي",
                    ExamType.Final => "امتحان نهائي",
                    ExamType.Assignment => "واجب",
                    _ => e.ToString()
                }
            });
        return Ok(items);
    }

    [HttpGet("attendance-statuses")]
    public ActionResult<IEnumerable<LookupItemDto>> GetAttendanceStatuses()
    {
        var items = Enum.GetValues(typeof(AttendanceStatus))
            .Cast<AttendanceStatus>()
            .Select(s => new LookupItemDto
            {
                Id = (int)s,
                Name = s switch
                {
                    AttendanceStatus.Present => "حاضر",
                    AttendanceStatus.Absent => "غائب",
                    AttendanceStatus.Late => "متأخر",
                    AttendanceStatus.Excused => "معذور",
                    _ => s.ToString()
                }
            });
        return Ok(items);
    }

    [HttpGet("salary-statuses")]
    public ActionResult<IEnumerable<LookupItemDto>> GetSalaryStatuses()
    {
        var items = Enum.GetValues(typeof(SalaryStatus))
            .Cast<SalaryStatus>()
            .Select(s => new LookupItemDto
            {
                Id = (int)s,
                Name = s switch
                {
                    SalaryStatus.Pending => "قيد الانتظار",
                    SalaryStatus.Paid => "مدفوع",
                    SalaryStatus.Cancelled => "ملغي",
                    _ => s.ToString()
                }
            });
        return Ok(items);
    }

    [HttpGet("months")]
    public ActionResult<IEnumerable<LookupItemDto>> GetMonths()
    {
        var monthNames = new[] { "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر" };
        var items = monthNames.Select((name, index) => new LookupItemDto { Id = index + 1, Name = name });
        return Ok(items);
    }
}

