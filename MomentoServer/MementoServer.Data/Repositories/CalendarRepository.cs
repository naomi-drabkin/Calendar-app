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
    public class CalendarRepository : ICalendarRepository
    {
        private readonly DataContext _context;

        public CalendarRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Calendar>> GetAllAsync()
        {
            return await _context.Calendars.ToListAsync();
        }

        public async Task<IEnumerable<Calendar>> GetByUserIdAsync(int userId)
        {
            return await _context.Calendars.Where(c => c.UserId == userId).ToListAsync();
        }

        public async Task<bool> AddAsync(Calendar calendar)
        {
            _context.Calendars.Add(calendar);
            return await _context.SaveChangesAsync() > 0;
        }

        

        public async Task<bool> UpdateAsync(Calendar calendar)
        {
            var existing = await _context.Calendars.FindAsync(calendar.Id);
            if (existing == null || existing.UserId != calendar.UserId) return false;
            existing.Title = calendar.Title;
            existing.Description = calendar.Description;
            existing.PdfUrl = calendar.PdfUrl;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int userId, int id)
        {
            var calendar = await _context.Calendars.FindAsync(id);
            if (calendar == null || calendar.UserId != userId) return false;
            _context.Calendars.Remove(calendar);
            await _context.SaveChangesAsync();
            return true;
        }
    }

}
