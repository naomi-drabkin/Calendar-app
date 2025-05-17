using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MomentoServer.Core.Entities;
using MomentoServer.Core.IRepositories;

namespace MementoServer.Data.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;

        public UserRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> GetByIdAsync(int id)
        {
            return await _context.Set<User>().FindAsync(id);
        }

        public async Task<User> GetByEmailAsync(string email)
        {
            return await _context.Users.Include(u=>u.Roles).FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task AddAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
               _context.Users.Remove(user);
               await _context.SaveChangesAsync();
                return true;    
            }
            return false;
        }

        public async Task<bool> UpdateUserAsync(int id ,User user)
        {
            var userForUpdate = _context.Users.Find(id);
            if(userForUpdate != null)
            {
                userForUpdate.Email = user.Email;
                userForUpdate.Password = user.Password;
                userForUpdate.UserName = user.UserName;
                userForUpdate.UserFamily = user.UserFamily;
                await _context.SaveChangesAsync();
                return true;
            }
           return false;    
        }
    }
    }
