using System.Diagnostics;

namespace ObscuritasMediaManager.ClientInterop.Commands;

public class OpenChromeForDebuggingHandler : ICommandHandler
{
    private static Process? _process;

    public static void TerminateProcess()
    {
        _process?.CloseMainWindow();
        _process?.Dispose();
        _process = null;
    }

    public InteropCommand Command => InteropCommand.OpenChromeForDebugging;

    public async Task ExecuteAsync(JsonElement? payload)
    {
        await Task.CompletedTask;
        var close = payload?.GetProperty("close").GetBoolean() == true;
        if (close || _process?.HasExited == true) TerminateProcess();
        if (close || _process is not null) return;

        _process = Process.Start(new ProcessStartInfo
        {
            FileName = @"C:\Program Files\Google\Chrome\Application\chrome.exe",
            Arguments = "--remote-debugging-port=8083 --no-startup-window",
            CreateNoWindow = true,
            WindowStyle = ProcessWindowStyle.Minimized
        })!;
        _process.Exited += (_, _) => _process = null;
    }
}