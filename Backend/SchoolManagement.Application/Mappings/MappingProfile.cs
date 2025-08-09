using AutoMapper;
using SchoolManagement.Domain.Entities;
using SchoolManagement.Shared.DTOs.Auth;
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
    }
}