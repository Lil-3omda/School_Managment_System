using AutoMapper;
using SchoolManagement.Domain.Entities;
using SchoolManagement.Shared.DTOs.Auth;
using SchoolManagement.Shared.DTOs.Classes;
using SchoolManagement.Shared.DTOs.Subjects;
using SchoolManagement.Shared.DTOs.Teachers;
using SchoolManagement.Shared.DTOs.Students;

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
    }
}