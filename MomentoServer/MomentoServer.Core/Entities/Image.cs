using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MomentoServer.Core.Entities
{
    public class Image
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey(nameof(UserId))]
        public int UserId { get; set; }
        public User User { get; set; }

        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string Event { get; set; }

        [Required]
        public DateTime UploadDate { get; set; }
    }
}
