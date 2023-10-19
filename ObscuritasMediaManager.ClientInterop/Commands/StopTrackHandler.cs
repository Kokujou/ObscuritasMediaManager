using System;
using System.Linq;

namespace ObscuritasMediaManager.ClientInterop.Commands;

public class StopTrackHandler : ICommandHandler
{
    public InteropCommand Command => InteropCommand.StopTrack;

    public async Task ExecuteAsync(object? payload)
    {
        await Task.Yield();
        AudioService.Stop();
    }
}
