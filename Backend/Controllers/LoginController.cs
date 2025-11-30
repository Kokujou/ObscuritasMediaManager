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
        _ = await userRepository.LogonAsync(request.Username, request.Password) ??
            throw new("invalid username or password");
        var token = $"{request.Username}:{request.Password}".ToBase64String();
        Response.Cookies.Append("Authorization", $"{token}",
            new() { Expires = DateTimeOffset.MaxValue, Path = HttpContext.Request.PathBase });
        return token;
    }

    [HttpPost("register")]
    public async Task RegisterAsync(CredentialsRequest request)
    {
        await userRepository.CreateUser(request.Username, request.Password);
    }
}