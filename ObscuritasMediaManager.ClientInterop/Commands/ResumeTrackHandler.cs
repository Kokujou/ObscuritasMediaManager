using System;
using System.Linq;

namespace ObscuritasMediaManager.ClientInterop.Commands;

public class ResumeTrackHandler : ICommandHandler
{
    public InteropCommand Command => InteropCommand.ResumeTrack;

    public async Task ExecuteAsync(object? payload)
    {
        await Task.Yield();
        AudioService.Play();
    }
}
