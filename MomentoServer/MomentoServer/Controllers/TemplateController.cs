using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MomentoServer.Core.DTOs.TemplatesDTO;
using MomentoServer.Core.Entities;
using MomentoServer.Core.IServices;

namespace MomentoServer.Api.Controllers
{
    [Route("api/templates")]
    [ApiController]
    [Authorize(Policy = "Admin")]
    public class TemplateController : ControllerBase
    {
        private readonly ITemplateService _service;
        public TemplateController(ITemplateService service) { _service = service; }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TemplateDto>>> GetTemplates()
        {
            return Ok(await _service.GetAllTemplatesAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TemplateDto>> GetTemplate(int id)
        {
            var template = await _service.GetTemplateByIdAsync(id);
            if (template == null) return NotFound();
            return Ok(template);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTemplate(TemplateDto templateDto)
        {
            await _service.AddTemplateAsync(templateDto);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTemplate(int id, TemplateDto templateDto)
        {
            await _service.UpdateTemplateAsync(id, templateDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTemplate(int id)
        {
            await _service.DeleteTemplateAsync(id);
            return NoContent();
        }

        [HttpPost("upload-image")]
        [Consumes("multipart/form-data")]
        //[ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        //[ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UploadTemplateImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var imageUrl = await _service.UploadTemplateImageAsync(file);
            return Ok(new { imageUrl });
        }
    }


}
