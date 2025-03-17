using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MomentoServer.Core.Entities
{
    public class Permissions
    {

        public int Id { get; set; }
        public string PermissionName { get; set; }
        public string Description { get; set; }
        public ICollection<Roles> Roles { get; set; }

    }
}
