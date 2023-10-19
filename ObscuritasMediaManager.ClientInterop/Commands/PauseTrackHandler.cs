using System;
using System.Linq;

namespace ObscuritasMediaManager.ClientInterop.Commands;

public class PauseTrackHandler : ICommandHandler
{
    public InteropCommand Command => InteropCommand.PauseTrack;

    public async Task ExecuteAsync(object? payload)
    {
        await Task.Yield();
        AudioService.Pause();
    }
}
