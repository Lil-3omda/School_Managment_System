using AutoMapper;
using SchoolManagement.Domain.Entities;
using SchoolManagement.Shared.DTOs.Auth;
using SchoolManagement.Shared.DTOs.Classes;
using SchoolManagement.Shared.DTOs.Subjects;
using SchoolManagement.Shared.DTOs.Teachers;
using SchoolManagement.Shared.DTOs.Students;
using SchoolManagement.Shared.DTOs.Attendance;
using SchoolManagement.Shared.DTOs.Exams;
using SchoolManagement.Shared.DTOs.Grades;
using SchoolManagement.Shared.DTOs.Salaries;

namespace SchoolManagement.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // User mappings
        CreateMap<User, UserDto>();

        // Student mappings
        CreateMap<Student, StudentDto>()
            .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src => src.Class.Name));
        
        CreateMap<CreateStudentDto, Student>()
            .ForMember(dest => dest.User, opt => opt.MapFrom(src => new User
            {
                FirstName = src.FirstName,
                LastName = src.LastName,
                Email = src.Email,
                PhoneNumber = src.PhoneNumber,
                DateOfBirth = src.DateOfBirth,
                Gender = src.Gender,
                Address = src.Address,
                Role = Domain.Enums.UserRole.Student,
                IsActive = true
            }));

        // Teacher mappings
        CreateMap<Teacher, TeacherDto>();
        CreateMap<CreateTeacherDto, Teacher>()
            .ForMember(dest => dest.User, opt => opt.MapFrom(src => new User
            {
                FirstName = src.FirstName,
                LastName = src.LastName,
                Email = src.Email,
                PhoneNumber = src.PhoneNumber,
                DateOfBirth = src.DateOfBirth,
                Gender = src.Gender,
                Address = src.Address,
                Role = Domain.Enums.UserRole.Teacher,
                IsActive = true
            }));

        // Class mappings
        CreateMap<Class, ClassDto>()
            .ForMember(dest => dest.StudentCount, opt => opt.MapFrom(src => src.Students.Count(s => !s.IsDeleted)));
        CreateMap<CreateClassDto, Class>();

        // Subject mappings
        CreateMap<Subject, SubjectDto>();
        CreateMap<CreateSubjectDto, Subject>();

        // Attendance mappings
        CreateMap<Attendance, AttendanceDto>()
            .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src => src.Class.Name))
            .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src => src.Student != null ? src.Student.User.FullName : null))
            .ForMember(dest => dest.TeacherName, opt => opt.MapFrom(src => src.Teacher != null ? src.Teacher.User.FullName : null));
        CreateMap<CreateAttendanceDto, Attendance>();

        // Exam mappings
        CreateMap<Exam, ExamDto>()
            .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src => src.Class.Name))
            .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.Subject.Name));
        CreateMap<CreateExamDto, Exam>();

        // Grade mappings
        CreateMap<Grade, GradeDto>()
            .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src => src.Student.User.FullName))
            .ForMember(dest => dest.ExamName, opt => opt.MapFrom(src => src.Exam.Name))
            .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.Exam.Subject.Name))
            .ForMember(dest => dest.TotalMarks, opt => opt.MapFrom(src => src.Exam.TotalMarks))
            .ForMember(dest => dest.ExamDate, opt => opt.MapFrom(src => src.Exam.ExamDate));
        CreateMap<CreateGradeDto, Grade>();

        // Salary mappings
        CreateMap<Salary, SalaryDto>()
            .ForMember(dest => dest.TeacherName, opt => opt.MapFrom(src => src.Teacher.User.FullName));
        CreateMap<CreateSalaryDto, Salary>();
    }
}