using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MomentoServer.Core.DTOs.CalendarDTO;
using MomentoServer.Core.DTOs.ImagesDTOs;
using MomentoServer.Core.DTOs.TemplatesDTO;
using MomentoServer.Core.DTOs.UsersDTOs;
using MomentoServer.Core.Entities;

namespace MomentoServer.Core
{
    public class MappingProfile:Profile
    {

        public MappingProfile()
        {
            CreateMap<User, DTOuser>().ReverseMap();
            CreateMap<DTOregister, User>().ReverseMap();
            CreateMap<DTOuser, User>().ReverseMap();
            CreateMap<Template, TemplateDto>().ReverseMap();
            CreateMap<ImageCreateDTO, Image>().ReverseMap();
            CreateMap<ImageUpdateDTO, Image>().ReverseMap();
            CreateMap<Image, ImageDTO>().ReverseMap();
            CreateMap<Calendar, CalendarDTO>().ReverseMap();
            CreateMap<Roles, string>().ReverseMap();


        }
    }
}
