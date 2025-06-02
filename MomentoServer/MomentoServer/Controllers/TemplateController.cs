using System.Linq;
using System.Web;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MomentoServer.Core.DTOs.TemplatesDTO;
using MomentoServer.Core.Entities;
using MomentoServer.Core.IServices;

namespace MomentoServer.Api.Controllers
{
    [Route("api/templates")]
    [ApiController]
    public class TemplateController : ControllerBase
    {
        private readonly ITemplateService _service;
        private readonly UploadFiles _uploadfiles;
        private string _bucketName = "my-momento-dataimages";
        private IAmazonS3 _s3Client;

        public TemplateController(ITemplateService service, UploadFiles uploadfiles, IAmazonS3 s3Client, IConfiguration configuration)
        {
            _service = service;
            _uploadfiles = uploadfiles;
            _s3Client = s3Client;
            _bucketName = "my-momento-dataimages";


        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TemplateDto>>> GetTemplates()
        {
            return Ok(await _service.GetAllTemplatesAsync());
        }

        [Authorize(Policy = "Admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<TemplateDto>> GetTemplate(int id)
        {
            var template = await _service.GetTemplateByIdAsync(id);
            if (template == null) return NotFound();
            return Ok(template);
        }

        [Authorize(Policy = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTemplate(int id, TemplateDto templateDto)
        {
            await _service.UpdateTemplateAsync(id, templateDto);
            return NoContent();
        }

        [Authorize(Policy = "Admin")]
        [HttpDelete("delete-template/{fileName}")]
        public async Task<IActionResult> DeleteTemplate(string fileName)
        {
            try
            {
                Console.WriteLine(fileName);
                var decodedFileName = HttpUtility.UrlDecode(fileName);
                Console.WriteLine($"[מחיקה] בקשת מחיקה עבור: {decodedFileName}");

                var deleteRequest = new DeleteObjectRequest
                {
                    BucketName = _bucketName,
                    Key = $"{decodedFileName}"
                };

                var response = await _s3Client.DeleteObjectAsync(deleteRequest);

                Console.WriteLine($"[מחיקה] סטטוס תשובה מ-S3: {response.HttpStatusCode}");

                return NoContent();
            }
            catch (AmazonS3Exception s3Ex)
            {
                Console.WriteLine($"[שגיאה S3] קוד שגיאה: {s3Ex.ErrorCode}");
                Console.WriteLine($"[שגיאה S3] הודעה: {s3Ex.Message}");
                Console.WriteLine($"[שגיאה S3] תגובה: {s3Ex.ResponseBody}");

                return BadRequest(new { message = $"שגיאת S3: {s3Ex.Message}" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[שגיאה כללית] {ex}");

                return BadRequest(new { message = $"שגיאה כללית: {ex.Message}" });
            }
        }


        [Authorize(Policy = "Admin")]
        [HttpPost("upload-image")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile file, [FromForm] string fileName)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "לא נשלח קובץ." });
            }

            var allowedExtensions = new HashSet<string> { ".jpg", ".jpeg", ".png" };

            var fileExtension = Path.GetExtension(fileName).ToLower();

            if (!allowedExtensions.Contains(fileExtension))
            {
                return BadRequest(new { message = "❌ ניתן להעלות רק קבצים מסוג JPG, JPEG או PNG." });
            }

            var contentType = fileExtension switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                _ => "application/octet-stream" 
            };

            var folderName = "Templates";
            var key = $"{folderName}/{fileName}";
            // בקשת העלאה ל-S3
            var putRequest = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = key,
                InputStream = file.OpenReadStream(),
                ContentType = contentType
            };

            // העלאת הקובץ ל-S3
            await _s3Client.PutObjectAsync(putRequest);

            var publicUrl = $"https://{_bucketName}.s3.us-east-1.amazonaws.com/{key}";

            return Ok(new { publicUrl });
        }


        [HttpGet("get-all-templates")]
        public async Task<IActionResult> GetAllTemplates()
        {
            try
            {
                var request = new ListObjectsV2Request
                {
                    BucketName = _bucketName,
                    Prefix = "Templates/"
                };

                var response = await _s3Client.ListObjectsV2Async(request);

                var templates = response.S3Objects
                .OrderByDescending(obj => obj.LastModified) // מיון לפי תאריך
                .Select(obj => new
                {
                        Name = Path.GetFileNameWithoutExtension(obj.Key),
                        FileName = obj.Key,
                        ImageUrl = $"https://{_bucketName}.s3.amazonaws.com/{obj.Key}",
                        UploadedAt = obj.LastModified
                }).ToList();

                    return Ok(templates);
                }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"שגיאה בשליפת הקבצים: {ex.Message}" });
            }
        }
    }


    }
