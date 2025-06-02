using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using MomentoServer.Core.DTOs.CalendarDTO;
using MomentoServer.Core.IServices;

namespace MomentoServer.Api.Controllers
{
    [ApiController]
    [Route("api/calendars")]
    public class CalendarController : ControllerBase
    {
        private readonly ICalendarService _calendarService;

        public CalendarController(ICalendarService calendarService)
        {
            _calendarService = calendarService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllCalendars()
        {
            var calendars = await _calendarService.GetAllCalendarsAsync();
            return Ok(calendars);
        }

        [HttpGet("user")] 
        [Authorize]
        public async Task<IActionResult> GetUserCalendars()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var calendars = await _calendarService.GetUserCalendarsAsync(userId);
            return Ok(calendars);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateCalendar([FromBody] CalendarDTO calendarDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var calendar = await _calendarService.CreateCalendarAsync(userId, calendarDto);
            return CreatedAtAction(nameof(GetUserCalendars), new { }, calendar);
        }


        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateCalendar(int id, [FromBody] CalendarDTO calendarDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var updated = await _calendarService.UpdateCalendarAsync(userId, id, calendarDto);
            if (!updated) return Forbid();
 
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteCalendar(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var deleted = await _calendarService.DeleteCalendarAsync(userId, id);
            if (!deleted) return Forbid();
            return NoContent();
        }
    }
}
