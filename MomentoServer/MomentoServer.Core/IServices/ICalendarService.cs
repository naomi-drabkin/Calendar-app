using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MomentoServer.Core.DTOs.CalendarDTO;
using MomentoServer.Core.Entities;

namespace MomentoServer.Core.IServices
{
    public interface ICalendarService
    {
        Task<IEnumerable<Calendar>> GetAllCalendarsAsync();
        Task<List<Calendar>> GetUserCalendarsAsync(int userId);
        Task<bool> CreateCalendarAsync(int userId, CalendarDTO calendarDto);
        Task<bool> UpdateCalendarAsync(int userId, int id, CalendarDTO calendarDto);
        Task<bool> DeleteCalendarAsync(int userId, int id);
    }
}
