using System;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MomentoServer.Core.DTOs.UsersDTOs;
using MomentoServer.Core.Entities;
using MomentoServer.Core.IServices;

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration config)
    {
        _configuration = config;
    }

    public string GenerateToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        //Console.WriteLine($"User Role: {user.Role}");
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            //new Claim(ClaimTypes.Role,user.Role),
            new Claim("Password", user.Password),
            new Claim("ID", user.Id.ToString()),

        };
        if (user.Roles != null)
        {
            foreach (var role in user.Roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role.RoleName));
            }
        }
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(30),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );


        //var token = tokenHandler.CreateToken(tokenDescriptor);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}