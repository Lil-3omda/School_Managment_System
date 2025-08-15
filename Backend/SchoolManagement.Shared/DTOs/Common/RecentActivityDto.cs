namespace SchoolManagement.Shared.DTOs.Common;

public class RecentActivityDto
{
    public int Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
}