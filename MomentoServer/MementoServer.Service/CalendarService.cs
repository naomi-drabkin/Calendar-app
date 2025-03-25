using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MomentoServer.Core.DTOs.CalendarDTO;
using MomentoServer.Core.DTOs.ImagesDTOs;
using MomentoServer.Core.Entities;
using MomentoServer.Core.IRepositories;
using MomentoServer.Core.IServices;

namespace MementoServer.Service
{
    public class CalendarService : ICalendarService
    {
        private readonly ICalendarRepository _calendarRepository;
        private readonly IMapper _mapper;


        public CalendarService(ICalendarRepository calendarRepository,IMapper mapper)
        {
            _calendarRepository = calendarRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<Calendar>> GetAllCalendarsAsync()
        {
            return await _calendarRepository.GetAllAsync();
        }

        public async Task<List<Calendar>> GetUserCalendarsAsync(int userId)
        {
            return (await _calendarRepository.GetByUserIdAsync(userId)).ToList();
        }

        public async Task<bool> CreateCalendarAsync(int userId, CalendarDTO calendarDto)
        {
            var countCalendars = await _calendarRepository.GetByUserIdAsync(userId);
            var CalendarEntity = _mapper.Map<Calendar>(calendarDto);
            CalendarEntity.UserId = userId;
            return await _calendarRepository.AddAsync(CalendarEntity);
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
