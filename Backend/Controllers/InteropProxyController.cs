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
        if (connectionChecker.IsConnected) return;
        try
        {
            using var httpClient = new HttpClient();
            var result = await httpClient.GetAsync("http://localhost:8005", token);
            return;
        }
        catch
        {
            // not connected
        }

        while (!connectionChecker.IsConnected && !token.IsCancellationRequested) await Task.Yield();
    }
}