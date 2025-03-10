using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MomentoServer.Core.DTOs;
using MomentoServer.Core.Entities;

namespace MomentoServer.Core
{
    public class MappingProfile:Profile
    {

        public MappingProfile()
        {
            CreateMap<User, DTOuser>().ReverseMap();
            CreateMap<DTOregister, User>();
            CreateMap<DTOuser, User>().ReverseMap();
        }
    }
}
