using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MomentoServer.Core.DTOs.CalendarDTO;
using MomentoServer.Core.Entities;
using MomentoServer.Core.IRepositories;
using MomentoServer.Core.IServices;

namespace MementoServer.Service
{
    public class CalendarService : ICalendarService
    {
        private readonly ICalendarRepository _calendarRepository;

        public CalendarService(ICalendarRepository calendarRepository)
        {
            _calendarRepository = calendarRepository;
        }

        public async Task<IEnumerable<Calendar>> GetAllCalendarsAsync()
        {
            return await _calendarRepository.GetAllAsync();
        }

        public async Task<IEnumerable<Calendar>> GetUserCalendarsAsync(int userId)
        {
            return await _calendarRepository.GetByUserIdAsync(userId);
        }

        public async Task<Calendar> CreateCalendarAsync(int userId, CalendarDTO calendarDto)
        {
            var calendar = new Calendar
            {
                UserId = userId,
                Title = calendarDto.Title,
                Description = calendarDto.Description,
                PdfUrl = calendarDto.PdfUrl
            };
            return await _calendarRepository.AddAsync(calendar);
        }

        public async Task<bool> UpdateCalendarAsync(int userId, int id, CalendarDTO calendarDto)
        {
            var calendar = new Calendar
            {
                Id = id,
                UserId = userId,
                Title = calendarDto.Title,
                Description = calendarDto.Description,
                PdfUrl = calendarDto.PdfUrl
            };
            return await _calendarRepository.UpdateAsync(calendar);
        }

        public async Task<bool> DeleteCalendarAsync(int userId, int id)
        {
            return await _calendarRepository.DeleteAsync(userId, id);
        }
    }

}
