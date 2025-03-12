using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using MomentoServer.Core.DTOs.TemplatesDTO;
using MomentoServer.Core.Entities;
using MomentoServer.Core.IRepositories;
using MomentoServer.Core.IServices;

namespace MementoServer.Service
{
    public class TemplateService : ITemplateService
    {
        private readonly ITemplateRepository _repository;
        private readonly IMapper _mapper;

        public TemplateService(ITemplateRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<TemplateDto>> GetAllTemplatesAsync()
        {
            var templates = await _repository.GetAllTemplatesAsync();
            return _mapper.Map<IEnumerable<TemplateDto>>(templates);
        }

        public async Task<TemplateDto> GetTemplateByIdAsync(int id)
        {
            var template = await _repository.GetTemplateByIdAsync(id);
            return _mapper.Map<TemplateDto>(template);
        }

        public async Task AddTemplateAsync(TemplateDto templateDto)
        {
            var template = _mapper.Map<Template>(templateDto);
            await _repository.AddTemplateAsync(template);
        }

        public async Task UpdateTemplateAsync(int id, TemplateDto templateDto)
        {
            var template = _mapper.Map<Template>(templateDto);
            template.Id = id;
            await _repository.UpdateTemplateAsync(id ,template);
        }

        public async Task DeleteTemplateAsync(int id) => await _repository.DeleteTemplateAsync(id);

        public async Task<string> UploadTemplateImageAsync(IFormFile file)
        {
            string uploadPath = Path.Combine(Directory.GetCurrentDirectory(),"TemplatesUploads");
            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }
            var filePath = Path.Combine(uploadPath, file.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return $"/uploads/{file.FileName}";
        }
    }
}
