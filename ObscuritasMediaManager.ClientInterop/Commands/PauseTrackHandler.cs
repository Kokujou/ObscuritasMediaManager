using ObscuritasMediaManager.ClientInterop.Evemts;
using System;
using System.Linq;

namespace ObscuritasMediaManager.ClientInterop.Commands;

public class PauseTrackHandler : ICommandHandler
{
    public InteropCommand Command => InteropCommand.PauseTrack;

    public async Task ExecuteAsync(JsonElement? payload)
    {
        await Task.Yield();
        AudioService.Pause();
        AudioTrackUpdatedEventService.StopReporting();
    }
}
