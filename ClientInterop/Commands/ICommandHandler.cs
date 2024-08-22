namespace ObscuritasMediaManager.ClientInterop.Commands;

internal interface ICommandHandler
{
    InteropCommand Command { get; }
    Task ExecuteAsync(JsonElement? payload);
}