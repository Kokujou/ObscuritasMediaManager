using Microsoft.AspNetCore.Mvc;
using ObscuritasMediaManager.Backend.Controllers.Requests;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Extensions;

namespace ObscuritasMediaManager.Backend.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class LoginController : ControllerBase
{
    private readonly UserRepository _userRepository;

    public LoginController(UserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    [HttpPost]
    public async Task<ActionResult<string>> LoginAsync(CredentialsRequest request)
    {
        var user = await _userRepository.LogonAsync(request.Username, request.Password);
        if (user is null) return BadRequest("invalid username or password");
        return $"{request.Username}:{request.Password}".ToBase64String();
    }
}