using Microsoft.Playwright;
using ObscuritasMediaManager.ClientInterop.Events;
using ObscuritasMediaManager.ClientInterop.Requests;
using System.Diagnostics.CodeAnalysis;

namespace ObscuritasMediaManager.ClientInterop.Queries;

public class AutoFillAnimeCommandHandler : IQueryHandler
{
    private static IBrowserContext? _browser;

    public static void TerminateProcess()
    {
        if (_browser is null) return;

        _browser.CloseAsync();
        _browser.DisposeAsync();
        _browser = null;
    }

    private static void OnExited(IBrowser _)
    {
        WebSocketInteropServer.BroadcastEvent(new ChromeClosedEvent());
    }

    public InteropQuery Query => InteropQuery.AutoFillAnime;

    public async Task<object?> ExecuteAsync(JsonElement? payload)
    {
        var request = payload?.Deserialize<AutoFillAnimeQueryRequest>(WebSocketInteropClient.DefaultJsonOptions)!;

        await EnsureChromeInstance();
        return await AnimeLoadsService.AutoFillAnimeAsync(_browser, request.IsMovie, request.Name);
    }

    [MemberNotNull(nameof(_browser))]
    private async Task EnsureChromeInstance()
    {
        if (_browser is not null) return;

        try
        {
            _browser = await (await Playwright.CreateAsync()).Chromium.LaunchPersistentContextAsync(
                "./playwright-context", new()
                {
                    ExecutablePath = @"C:\Program Files\Google\Chrome\Application\chrome.exe", SlowMo = 200
                });
        }
        catch
        {
            OnExited(null!);
            throw;
        }
    }
}