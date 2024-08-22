using ObscuritasMediaManager.ClientInterop.Events;

namespace ObscuritasMediaManager.ClientInterop.Commands;

public class StopTrackHandler : ICommandHandler
{
    public InteropCommand Command => InteropCommand.StopTrack;

    public async Task ExecuteAsync(JsonElement? payload)
    {
        await Task.Yield();
        AudioService.Stop();
        AudioTrackUpdatedEventHandler.StopReporting();
    }
}