using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MomentoServer.Core.Entities
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string UserName { get; set; }
        public string UserFamily { get; set; }

        public int CountCalendar { get; set; } = 0;
        //public string Role { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public ICollection<Image> Images { get; set; }
        //public Calendar Calendar { get; set; }
        public ICollection<Roles> Roles { get; set; } = new List<Roles>();


    }
}

