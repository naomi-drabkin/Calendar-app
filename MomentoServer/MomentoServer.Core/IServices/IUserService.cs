using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MomentoServer.Core.DTOs.UsersDTOs;
using MomentoServer.Core.Entities;

namespace MomentoServer.Core.IServices
{
    public interface IUserService
    {

        Task<IEnumerable<DTOuser>> GetAllAsync();
        Task<IEnumerable<string>> GetAllEmailsAsync();
        Task<DTOuser> GetByIdAsync(int id);
        Task<AuthResponse> Register(DTOregister user);
        Task<AuthResponse> Login(string email, string password);
        Task<bool> DeleteUserAsync(int id);
        Task<bool> UpdateUserAsync(int id, DTOuser user);


    }
}
