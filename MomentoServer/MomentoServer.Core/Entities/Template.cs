using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MomentoServer.Core.Entities
{
    public class Template
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }

        [ForeignKey(nameof(UserId))]
        public int ?UserId { get; set; }
        public User User { get; set; }
        public string Url { get; set; }

        //[ForeignKey(nameof(ImageUrl))]
        //public int ImageUrl { get; set; }
        //public Image Image { get; set; }
    }
}
