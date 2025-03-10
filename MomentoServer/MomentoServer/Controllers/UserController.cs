using System.Security.Claims;
using MementoServer.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MomentoServer.Core.DTOs;
using MomentoServer.Core.Entities;
using MomentoServer.Core.IServices;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MomentoServer.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ITokenService _TokenService;


        public UserController(IUserService userService, ITokenService TokenService)
        {
            _userService = userService;
            _TokenService = TokenService;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public IActionResult GetUsers()
        {
            return Ok(_userService.GetAll());
        }

        //[HttpGet("{id}")]
        //public IActionResult GetById(int id)
        //{
        //    var user = _userService.GetById(id);
        //    if (user == null)
        //    {
        //        return NotFound();
        //    }
        //    return Ok(user);
        //}

        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody] DTOregister user)
        {
            var success = _userService.Register(user);
            if (!success) return BadRequest(new { message = "User already exists" });

            return Ok(new { message = "User registered successfully" });
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login([FromBody] DTOlogin request)
        {
            var userDto = _userService.Login(request.Email, request.Password);
            if (userDto == null)
                return Unauthorized(new { message = "Invalid credentials" });

            //var token = _userService.Login(userDto);
            //return Ok(new { message = "User login successfully" });

            return Ok(new
            {
                Token = userDto.Token,
                User = userDto.User
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            var success = _userService.DeleteUser(id);
            if (!success) return NotFound();
            return NoContent();
        }

        [Authorize]
        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, [FromBody] DTOuser user)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            if (userId != id)
            {
                return Forbid();
            }

            var result = _userService.UpdateUser(id, user);
            if (result)
            {
                return Ok("User updated successfully");
            }
            return NotFound("User not found");
        }

        [Authorize]
        [HttpGet("test")]
        public IActionResult Test()
        {
            var claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();
            return Ok(claims);
        }
    }
}

