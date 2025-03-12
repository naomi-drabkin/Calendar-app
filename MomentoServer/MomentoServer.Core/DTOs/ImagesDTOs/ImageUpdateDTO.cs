using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace MomentoServer.Core.DTOs.ImagesDTOs
{
    public class ImageUpdateDTO
    {
        public IFormFile? File { get; set; } // אופציונלי
        public DateTime? UploadDate { get; set; } // אופציונלי
        public string? Event { get; set; }
    }
}
