﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MomentoServer.Core.DTOs
{
    public class DTOregister
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string UserName { get; set; }
        public string UserFamily { get; set; }
        public string Role { get; set; }

    }
}
