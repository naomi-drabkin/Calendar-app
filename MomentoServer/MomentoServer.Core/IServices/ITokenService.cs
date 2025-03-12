using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MomentoServer.Core.DTOs.UsersDTOs;
using MomentoServer.Core.Entities;

namespace MomentoServer.Core.IServices
{
    public interface ITokenService
    {
        string GenerateToken(DTOuser user);

    }
}
