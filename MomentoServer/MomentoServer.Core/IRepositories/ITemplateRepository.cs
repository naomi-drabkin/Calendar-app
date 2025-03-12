using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MomentoServer.Core.DTOs.TemplatesDTO;
using MomentoServer.Core.Entities;

namespace MomentoServer.Core.IRepositories
{
    public interface ITemplateRepository
    {
        Task<IEnumerable<Template>> GetAllTemplatesAsync();
        Task<Template> GetTemplateByIdAsync(int id);
        Task AddTemplateAsync(Template template);
        Task UpdateTemplateAsync(int id, Template template);
        Task DeleteTemplateAsync(int id);
    }
}
