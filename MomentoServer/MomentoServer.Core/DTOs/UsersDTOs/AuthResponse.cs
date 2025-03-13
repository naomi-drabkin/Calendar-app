using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MomentoServer.Core.Entities;

namespace MomentoServer.Core.DTOs.UsersDTOs
{
    public class AuthResponse
    {
        public string Token { get; set; }
        public User User { get; set; }
    }
}
