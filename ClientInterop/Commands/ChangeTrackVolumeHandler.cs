namespace ObscuritasMediaManager.ClientInterop.Commands;

public class ChangeTrackVolumeHandler : ICommandHandler
{
    public InteropCommand Command => InteropCommand.ChangeTrackVolume;

    public async Task ExecuteAsync(JsonElement? payload, Guid clientId)
    {
        await Task.Yield();
        AudioService.Volume = (float)payload?.GetDouble()!;
    }
}