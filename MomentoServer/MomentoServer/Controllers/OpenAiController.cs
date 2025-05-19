// Controllers/OpenAiController.cs
using Microsoft.AspNetCore.Mvc;
using MomentoServer.Core.Entities;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

[Route("api/[controller]")]
[ApiController]
public class OpenAiController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly HttpClient _httpClient;

    public OpenAiController(IConfiguration config)
    {
        _config = config;
        _httpClient = new HttpClient();
    }

    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] ChatRequest request)
    {
        var apiKey = _config["OpenAi:apiKey"];
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

        var body = new
        {
            model = "gpt-3.5-turbo",
            messages = new[] {
                new { role = "user", content = request.Message }
            }
        };

        var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");
        var response = await _httpClient.PostAsync("https://api.openai.com/v1/chat/completions", content);
        var result = await response.Content.ReadAsStringAsync();

        return Content(result, "application/json");
    }
}

