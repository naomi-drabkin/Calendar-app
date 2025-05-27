using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;
using MomentoServer.Core.Entities;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860
namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        [HttpPost]
        [Route("api/send-email")]
        public IActionResult SendEmail([FromBody] EmailData request)
        {
            try
            {
                var smtpClient = new SmtpClient("smtp.gmail.com")
                {
                    Port = 587,
                    Credentials = new NetworkCredential("momentodesigncalendar@gmail.com", "srtx rfgr elfx natl"),
                    EnableSsl = true,
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress("MomenTo@gmail.com"),
                    Subject = request.Subject,
                    //Body = request.Body,
                    Body = $@"
                    <div dir='rtl'>
                        <p>{request.Body}</p>
                        <img src='cid:invitationImage' style='max-width:100%;' />
                         <hr style='margin:20px 0;' />
           
                        <br/>
                        <br/>
                         <div style='color: #555;'>
                                <p style='margin:0; font-weight:bold;'>🎉 InvitationLine – <span style='font-style:italic;'>כי כל פרט חשוב</span></p>
                                <p style='margin:4px 0;'>🎨 עיצוב חכם ללוחות שנה, תבניות מותאמות אישית ועוד</p>
                                <p style='margin:4px 0;'>🌐 
                                    <a href='https://calendar-react-client.onrender.com' style='color:#0066cc; text-decoration:none;'>www.calendar-app.com</a>
                                </p>
                                <p style='margin:4px 0;'>📧 
                                    <a href='mailto:momentodesigncalendar@gmail.com?subject=פנייה%20לשירות%20לקוחות&body=שלום%20צוות%20Calendar%2C%0A%0Aברצוני%20לפנות%20אליכם%20בעניין%20...' 
                                       style='color:#0066cc; text-decoration:none;'>support@calendar.co.il</a>
                                </p>
                                <p style='margin:4px 0;'>📞 +1 (234) 567-8900</p>
                                <p style='margin-top:10px; font-size:12px; color:#888;'>
                                    הודעה זו נשלחה מ calendar. נשמח לסייע בכל שאלה או פנייה.
                                </p>
                            </div>
                    </div>",

                    IsBodyHtml = true,
                };
                mailMessage.To.Add(request.To);

                smtpClient.Send(mailMessage);
                return Ok("Email sent successfully");
            }
            catch (SmtpException smtpEx)
            {
                return BadRequest($"SMTP error: {smtpEx.Message}");
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred: {ex.Message}");
            }
        }
    }

}