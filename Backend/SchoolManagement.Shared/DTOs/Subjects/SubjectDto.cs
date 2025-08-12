using SchoolManagement.Shared.DTOs.Common;

namespace SchoolManagement.Shared.DTOs.Subjects;

public class SubjectDto : BaseDto
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Credits { get; set; }
}