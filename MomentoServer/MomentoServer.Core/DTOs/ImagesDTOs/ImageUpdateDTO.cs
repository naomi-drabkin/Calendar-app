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
        public string? Url { get; set; }
        public DateTime? EventDate { get; set; }
        public string? Event { get; set; }
        public int UserId { get; set; }

    }
}
