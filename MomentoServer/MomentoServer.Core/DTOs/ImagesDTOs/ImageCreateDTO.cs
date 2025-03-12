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
        [Required]
        public IFormFile File { get; set; }

        [Required]
        public DateTime UploadDate { get; set; }
        [Required]
        public string Event { get; set; }
    }
}
