using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MomentoServer.Core.DTOs
{
    public class AuthResponse
    {
        public string Token { get; set; }
        public DTOuser User { get; set; }
    }
}
