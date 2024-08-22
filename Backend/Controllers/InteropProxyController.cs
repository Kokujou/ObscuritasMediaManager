using Microsoft.AspNetCore.Mvc;
using ObscuritasMediaManager.Backend.Services;

namespace ObscuritasMediaManager.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InteropProxyController(InteropConnectionChecker connectionChecker) : ControllerBase
{
    [HttpGet]
    public async Task ConnectToInteropAsync(CancellationToken token)
    {
        while (!connectionChecker.IsConnected && !token.IsCancellationRequested) await Task.Yield();
    }
}