using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MomentoServer.Core.DTOs.CalendarDTO
{
    public class CalendarDTO
    {
        public int id { get; set; }
        public int userId { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }
        public string PdfUrl { get; set; }
    }
}
