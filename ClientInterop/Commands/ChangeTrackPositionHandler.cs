namespace ObscuritasMediaManager.ClientInterop.Commands;

public class ChangeTrackPositionHandler : ICommandHandler
{
    public InteropCommand Command => InteropCommand.ChangeTrackPosition;

    public async Task ExecuteAsync(JsonElement? payload)
    {
        await Task.Yield();
        var milliseconds = payload?.GetDouble() ?? 0;
        AudioService.SetPosition(TimeSpan.FromMilliseconds(milliseconds));
    }
}