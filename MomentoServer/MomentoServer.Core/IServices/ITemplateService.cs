using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using MomentoServer.Core.DTOs.TemplatesDTO;
using MomentoServer.Core.Entities;


namespace MomentoServer.Core.IServices
{
    public interface ITemplateService
    {
        Task<IEnumerable<TemplateDto>> GetAllTemplatesAsync();
        Task<TemplateDto> GetTemplateByIdAsync(int id);
        Task AddTemplateAsync(TemplateDto templateDto);
        Task UpdateTemplateAsync(int id, TemplateDto templateDto);
        Task DeleteTemplateAsync(int id);
        Task<string> UploadTemplateImageAsync(IFormFile file);
    }
}
