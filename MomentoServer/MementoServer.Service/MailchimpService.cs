using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

public class MailchimpService
{   
    private readonly string _apiKey = "d255859c098ae408d200c51510845d41-us6";
    private readonly string _listId = "5ada09a7d4";
    private readonly string _datacenter = "us6";

    public async Task SendEmailAsync(string subject, string body, string recipientEmail)
    {
        var client = new HttpClient();

        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");

        var emailContent = new
        {
            subject = subject,
            from_name = "Your Name",
            from_email = "your-email@example.com",
            to = new[]
            {
                new { email = recipientEmail, type = "to" }
            },
            html = body
        };

        var requestBody = JsonConvert.SerializeObject(emailContent);

        var response = await client.PostAsync(
            $"https://{_datacenter}.api.mailchimp.com/3.0/campaigns/{_listId}/actions/send",
            new StringContent(requestBody, Encoding.UTF8, "application/json")
        );

    }
}
