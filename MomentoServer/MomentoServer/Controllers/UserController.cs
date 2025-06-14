﻿using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MomentoServer.Core.DTOs.UsersDTOs;
using MomentoServer.Core.IServices;

namespace MomentoServer.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ITokenService _tokenService;

        public UserController(IUserService userService, ITokenService tokenService)
        {
            _userService = userService;
            _tokenService = tokenService;
        }

        [Authorize(Policy = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DTOuser>>> GetUsers()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }


        [Authorize(Policy = "Admin")]
        [HttpGet("emails")]
        public async Task<ActionResult<IEnumerable<string>>> GetEmails()
        {
            var emails = await _userService.GetAllEmailsAsync();
            return Ok(emails);
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] DTOregister user)
        {
            var success = await _userService.Register(user);
            if (success == null) return Unauthorized(new { message = "User already exists" });

            return Ok(new { Token = success.Token, User = success.User });
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] DTOlogin request)
        {
            var userDto = await _userService.Login(request.Email, request.Password);
            if (userDto == null)
                return Unauthorized(new { message = "Invalid credentials" });

            return Ok(new { Token = userDto.Token, User = userDto.User });
        }

        [Authorize(Policy = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var success = await _userService.DeleteUserAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] DTOuser user)
        {
           

            var result = await _userService.UpdateUserAsync(id, user);
            return result ? Ok(new { message = "User updated successfully" }) : NotFound("User not found");
        }

        [Authorize]
        [HttpGet("test")]
        public async Task<IActionResult> Test()
        {
            var claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();
            return await Task.FromResult(Ok(claims));
        }
    }
}
