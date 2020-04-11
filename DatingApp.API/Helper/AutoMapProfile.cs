using System.Linq;
using AutoMapper;
using DatingApp.API.Dtos;
using DatingApp.API.Models;

namespace DatingApp.API.Helper
{
    public class AutoMapProfile : Profile
    {
        public AutoMapProfile()
        {
            CreateMap<User, UserForListDto>().
            ForMember(dest => dest.PhotoUrl, 
            opt => opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain == true).Url)).
            ForMember(dest => dest.Age, opt => opt.ResolveUsing(src => src.DateOfBirth.CalculateAge()));
            CreateMap<User, UserForDetailsDto>().
            ForMember(dest => dest.PhotoUrl, 
            opt => opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain == true).Url)).
            ForMember(dest => dest.Age, opt => opt.ResolveUsing(src => src.DateOfBirth.CalculateAge()));
            CreateMap<Photo, PhotoForDetailsDto>();
            CreateMap<UserForUpdateDto,User>();
        }
    }
}