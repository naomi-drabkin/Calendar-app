using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace MomentoServer.Core.DTOs.ImagesDTOs
{
    public class ImageCreateDTO
    {
        //[Required]
        public string Url { get; set; }

        //[Required]
        public DateTime EventDate { get; set; }
        //[Required]
        public string Event { get; set; }
        public int UserId { get; set; }

        public string FileName { get; set; }

    }
}
