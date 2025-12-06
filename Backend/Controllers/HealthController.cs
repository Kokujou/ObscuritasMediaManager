using Microsoft.AspNetCore.Mvc;

namespace ObscuritasMediaManager.Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public bool CheckHealth()
    {
        return true;
    }
}