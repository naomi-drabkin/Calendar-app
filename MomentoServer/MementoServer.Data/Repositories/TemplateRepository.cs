using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MomentoServer.Core.Entities;
using MomentoServer.Core.IRepositories;

namespace MementoServer.Data.Repositories
{
    public class TemplateRepository : ITemplateRepository
    {
        private readonly DataContext _context;
        public TemplateRepository(DataContext context) { _context = context; }

        public async Task<IEnumerable<Template>> GetAllTemplatesAsync() => await _context.Templates.ToListAsync();

        public async Task<Template> GetTemplateByIdAsync(int id) => await _context.Templates.FindAsync(id);

        public async Task AddTemplateAsync(Template template)
        {
            await _context.Templates.AddAsync(template);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateTemplateAsync(int id,Template template)
        {
            _context.Templates.Update(template);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteTemplateAsync(int id)
        {
            var template = await _context.Templates.FindAsync(id);
            if (template != null)
            {
                _context.Templates.Remove(template);
                await _context.SaveChangesAsync();
            }
        }
    }
}
