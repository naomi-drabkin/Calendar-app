using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MomentoServer.Core.DTOs;
using MomentoServer.Core.Entities;

namespace MomentoServer.Core.IRepositories
{
    public interface IUserRepository
    {
        IEnumerable<User> GetAll();
        User GetById(int id);
        User GetByEmail(string email);
        void Add(User user);
        void DeleteUser(int id);
        void UpdateUser(User user);


    }
}
