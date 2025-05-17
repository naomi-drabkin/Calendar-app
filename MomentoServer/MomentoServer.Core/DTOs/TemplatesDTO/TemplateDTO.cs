using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MomentoServer.Core.DTOs.TemplatesDTO
{
    public class TemplateDto
    {
        public string Name { get; set; }
        public int ?UserId { get; set; }
        public string ImageUrl { get; set; }
    }
}
