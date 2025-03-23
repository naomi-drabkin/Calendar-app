using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MomentoServer.Core.DTOs.ImagesDTOs
{
    public class ImageDTO
    {
        public int Id { get; set; }
        public string Url { get; set; }
        //public string FilePath { get; set; }
        public DateTime EventDate { get; set; }
        public string Event { get; set; }
        public int UserId { get; set; }

        public string FileName { get; set; }

    }
}
