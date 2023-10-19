using System;
using System.Linq;
using System.Text.Json;

namespace ObscuritasMediaManager.ClientInterop.Commands;

public class LoadTrackHandler : ICommandHandler
{
    public InteropCommand Command => InteropCommand.LoadTrack;

    public async Task ExecuteAsync(object? payload)
    {
        await Task.Yield();
        var json = (JsonElement)payload!;
        var filePath = json.GetString()!;
        AudioService.ChangeTrack(filePath);
    }
}
