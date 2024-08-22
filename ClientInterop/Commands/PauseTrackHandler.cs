using ObscuritasMediaManager.ClientInterop.Events;

namespace ObscuritasMediaManager.ClientInterop.Commands;

public class PauseTrackHandler : ICommandHandler
{
    public InteropCommand Command => InteropCommand.PauseTrack;

    public async Task ExecuteAsync(JsonElement? payload)
    {
        await Task.Yield();
        AudioService.Pause();
        AudioTrackUpdatedEventHandler.StopReporting();
    }
}