using System.Diagnostics;

namespace ObscuritasMediaManager.ClientInterop.Commands;

public class OpenChromeForDebuggingHandler : ICommandHandler
{
    private static Process? _process;
    public InteropCommand Command => InteropCommand.OpenChromeForDebugging;

    public async Task ExecuteAsync(JsonElement? payload)
    {
        await Task.CompletedTask;
        if (payload?.GetProperty("close").GetBoolean() == true)
        {
            TerminateProcess();
            return;
        }

        if (_process is not null)
            return;

        _process = Process.Start(new ProcessStartInfo
        {
            FileName = @"C:\Program Files\Google\Chrome\Application\chrome.exe",
            Arguments = "--remote-debugging-port=8083",
            CreateNoWindow = true,
            WindowStyle = ProcessWindowStyle.Minimized
        })!;
        _process.Exited += (_, _) => _process = null;
    }

    public void TerminateProcess()
    {
        _process?.CloseMainWindow();
        _process?.Dispose();
        _process = null;
    }
}