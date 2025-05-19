using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MomentoServer.Core.Entities;

namespace MementoServer.Data
{
    public class DataContext:DbContext
    {

        public DbSet<User> Users { get; set; }

        public DbSet<Template> Templates { get; set; }

        public DbSet<Image> Images { get; set; }
        public DbSet<Calendar> Calendars { get; set; }



        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {

            var connectionString = Environment.GetEnvironmentVariable("Calendar__DB");
            var serverVersion = ServerVersion.AutoDetect(connectionString);
            optionsBuilder.UseMySql(connectionString, serverVersion);
        }


    }
}
