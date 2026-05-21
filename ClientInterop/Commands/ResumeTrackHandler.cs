namespace ObscuritasMediaManager.ClientInterop.Commands;

public class ResumeTrackHandler : ICommandHandler
{
    public InteropCommand Command => InteropCommand.ResumeTrack;

    public async Task ExecuteAsync(JsonElement? payload, Guid clientId)
    {
        await Task.Yield();
        AudioService.Play();
    }
}