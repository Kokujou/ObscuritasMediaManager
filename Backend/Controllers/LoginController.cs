using Microsoft.AspNetCore.Mvc;
using ObscuritasMediaManager.Backend.Controllers.Requests;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Extensions;

namespace ObscuritasMediaManager.Backend.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class LoginController(UserRepository userRepository) : ControllerBase
{
    [HttpPost]
    public async Task<string> LoginAsync(CredentialsRequest request)
    {
        var user = await userRepository.LogonAsync(request.Username, request.Password);
        if (user is null) throw new Exception("invalid username or password");

        var token = $"{request.Username}:{request.Password}".ToBase64String();
        Response.Cookies.Append("Authorization", $"Basic {token}", new CookieOptions { Expires = DateTimeOffset.MaxValue });
        return token;
    }
}