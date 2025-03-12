using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MomentoServer.Core.Entities
{
    public class Calendar
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey(nameof(UserId))]
        public int UserId { get; set; }
        public User User { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }
        public string PdfUrl { get; set; }
    }

}
