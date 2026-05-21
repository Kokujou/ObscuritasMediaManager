using ObscuritasMediaManager.ClientInterop.Attributes;

namespace ObscuritasMediaManager.ClientInterop.Commands;

[AllowAnonymous]
public class RegisterCommandHandler : ICommandHandler
{
    public InteropCommand Command => InteropCommand.Register;

    public async Task ExecuteAsync(JsonElement? payload, Guid clientId)
    {
        WebSocketInteropServer.RegisterClient(clientId);
    }
}