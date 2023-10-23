using ObscuritasMediaManager.ClientInterop.Evemts;
using System;
using System.Linq;

namespace ObscuritasMediaManager.ClientInterop.Commands;

public class ResumeTrackHandler : ICommandHandler
{
    public InteropCommand Command => InteropCommand.ResumeTrack;

    public async Task ExecuteAsync(JsonElement? payload)
    {
        await Task.Yield();
        AudioService.Play();
        AudioTrackUpdatedEventService.StartReporting();
    }
}
