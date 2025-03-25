using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MomentoServer.Core.Entities;

namespace MomentoServer.Core.IRepositories
{
    public interface ICalendarRepository
    {
        Task<IEnumerable<Calendar>> GetAllAsync();
        Task<IEnumerable<Calendar>> GetByUserIdAsync(int userId);
        Task<bool> AddAsync(Calendar calendar);
        Task<bool> UpdateAsync(Calendar calendar);
        Task<bool> DeleteAsync(int userId, int id);
    }
}
