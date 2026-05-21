namespace ObscuritasMediaManager.ClientInterop.Commands;

public class StopTrackHandler : ICommandHandler
{
    public InteropCommand Command => InteropCommand.StopTrack;

    public async Task ExecuteAsync(JsonElement? payload, Guid clientId)
    {
        await Task.Yield();
        AudioService.Stop();
    }
}