using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MomentoServer.Core.DTOs;
using MomentoServer.Core.Entities;

namespace MomentoServer.Core.IServices
{
    public interface IUserService
    {

        IEnumerable<DTOuser> GetAll();
        DTOuser GetById(int id);
        bool Register(DTOregister user);
        AuthResponse Login(string email, string password);
        bool DeleteUser(int id);
        bool UpdateUser(int id, DTOuser user);


    }
}
