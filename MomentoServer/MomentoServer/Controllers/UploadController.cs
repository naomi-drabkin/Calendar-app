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
        public async Task<IActionResult> GetPresignedUrl([FromQuery] string fileName)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = fileName,
                Verb = HttpVerb.PUT, // מאפשר העלאה
                Expires = DateTime.UtcNow.AddMinutes(5),
                ContentType = "image/jpeg" // או סוג הקובץ המתאים
            };


            string url = _s3Client.GetPreSignedURL(request);
            return Ok(new { url });
        }

    }
}