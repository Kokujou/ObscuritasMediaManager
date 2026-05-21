namespace ObscuritasMediaManager.ClientInterop.Commands;

public class PauseTrackHandler : ICommandHandler
{
    public InteropCommand Command => InteropCommand.PauseTrack;

    public async Task ExecuteAsync(JsonElement? payload, Guid clientId)
    {
        await Task.Yield();
        AudioService.Pause();
    }
}