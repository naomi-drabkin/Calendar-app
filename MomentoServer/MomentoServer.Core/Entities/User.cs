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
        public string Role { get; set; }
        public ICollection<Template> Templates { get; set; }
        public ICollection<Image> Images { get; set; }
        public ICollection<Calendar> Calendar { get; set; }
    }
}

