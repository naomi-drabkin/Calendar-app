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
        Task<IEnumerable<User>> GetAllAsync();
        Task<User> GetByIdAsync(int id);
        Task<User> GetByEmailAsync(string email);
        Task AddAsync(User user);
        Task<bool> DeleteUserAsync(int id);
        Task<bool> UpdateUserAsync(int id ,User user);


    }
}
