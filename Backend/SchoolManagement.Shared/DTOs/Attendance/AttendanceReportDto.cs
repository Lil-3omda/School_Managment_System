namespace SchoolManagement.Shared.DTOs.Attendance;

public class AttendanceReportDto
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int TotalStudents { get; set; }
    public int TotalDays { get; set; }
    public decimal OverallAttendanceRate { get; set; }
    public List<ClassAttendanceDto> ClassAttendance { get; set; } = new();
    public List<StudentAttendanceDto> StudentAttendance { get; set; } = new();
}

public class ClassAttendanceDto
{
    public int ClassId { get; set; }
    public string ClassName { get; set; } = string.Empty;
    public int TotalStudents { get; set; }
    public int PresentDays { get; set; }
    public int AbsentDays { get; set; }
    public decimal AttendanceRate { get; set; }
}

public class StudentAttendanceDto
{
    public int StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string ClassName { get; set; } = string.Empty;
    public int PresentDays { get; set; }
    public int AbsentDays { get; set; }
    public int LateDays { get; set; }
    public decimal AttendanceRate { get; set; }
}