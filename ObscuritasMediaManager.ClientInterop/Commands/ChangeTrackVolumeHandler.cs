using System;
using System.Linq;

namespace ObscuritasMediaManager.ClientInterop.Commands;

public class ChangeTrackVolumeHandler : ICommandHandler
{
    public InteropCommand Command => InteropCommand.ChangeTrackVolume;

    public async Task ExecuteAsync(JsonElement? payload)
    {
        await Task.Yield();
        AudioService.Volume = (float)payload?.GetDouble()!;
    }
}
