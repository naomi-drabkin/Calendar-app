using Amazon.S3.Model;
using Amazon.S3;
using Microsoft.AspNetCore.Mvc;
using Amazon.Runtime;
using Amazon.Runtime.CredentialManagement;

namespace MomentoServer.Api.Controllers
{

    [ApiController]
    [Route("api/upload")]
    public class UploadFiles : ControllerBase
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName = "my-momento-dataimages"; 
                                                                            

        public UploadFiles(IAmazonS3 s3Client)
        {
            _s3Client = s3Client;
        }

        [HttpGet("presigned-url")]
        public async Task<IActionResult> GetPresignedUrlAsync([FromQuery] string fileName)
        {
           
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

            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = fileName,
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(5),
                ContentType = contentType
            };

            string url = _s3Client.GetPreSignedURL(request);
            return Ok(new { url });
        }

        [HttpGet("download-url/{fileName}")]
        public async Task<string> GetDownloadUrlAsync(string fileName)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = fileName,
                Verb = HttpVerb.GET,
                Expires = DateTime.UtcNow.AddMinutes(60)
            };

            return _s3Client.GetPreSignedURL(request);
        }

    }
}