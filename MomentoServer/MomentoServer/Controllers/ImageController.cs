using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MomentoServer.Core.DTOs.ImagesDTOs;
using MomentoServer.Core.IServices;

namespace MomentoServer.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ImageController : ControllerBase
    {
        private readonly IImageService _imageService;

        public ImageController(IImageService imageService)
        {
            _imageService = imageService;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                throw new UnauthorizedAccessException("User is not authenticated.");

            return int.Parse(userIdClaim.Value);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage([FromBody] ImageCreateDTO imageDto)
        {
            try
            {
                var userId = GetUserId();
                var fileName = await _imageService.PostImageAsync(imageDto, userId);
                return Ok(new { message = "Image uploaded successfully", fileName });
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(new { error = "User is not authenticated" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        
        [HttpGet("all/{numOfCalendar}")]
        public async Task<IActionResult> GetAllImages(int numOfCalendar)
        {
            try
            {
                var userId = GetUserId();
                var images = await _imageService.GetAllImagesAsync(userId,numOfCalendar);
                return Ok(images);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(new { error = "User is not authenticated" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetImage(int id)
        {
            try
            {
                var image = await _imageService.GetImageByIdAsync(id);
                return image == null ? NotFound() : Ok(image);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateImage(int id,[FromBody] ImageUpdateDTO imageDto)
        {
            try
            {
                var success = await _imageService.UpdateImageAsync(id,imageDto);
                return success ? Ok(new { message = "Image updated successfully" }) : NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpDelete ("{id}")]
        public async Task<IActionResult> DeleteImage(int id)
        {
            try
            {
                var success = await _imageService.DeleteImageAsync(id);
                return success ? Ok(new { message = "Image deleted successfully" }) : NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpDelete("all/{userId}")]
        public async Task<IActionResult> DeleteAllImages(int usrId)
        {
            try
            {
                var success = await _imageService.DeleteAllImagesByIdAsync(usrId);
                return success ? Ok(new { message = "All your images deleted successfully" }) : NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

    }
}
