using ObscuritasMediaManager.ClientInterop.Commands;
using System;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using WebSocketSharp;

namespace ObscuritasMediaManager.ClientInterop;

public class WebSocketInterop : WebSocketBehavior
{
    private static Dictionary<InteropCommand, ICommandHandler> CommandHandlers { get; set; }

    static WebSocketInterop()
    {
        CommandHandlers = Assembly.GetExecutingAssembly()
            .GetExportedTypes()
            .Where(x => typeof(ICommandHandler).IsAssignableFrom(x))
            .Select(Activator.CreateInstance)
            .ToDictionary(x => ((ICommandHandler)x!).Command, x => (ICommandHandler)x!);
    }

    protected override async void OnMessage(MessageEventArgs e)
    {
        base.OnMessage(e);
        var deserialized = JsonSerializer.Deserialize<InteropMessage>(
            e.Data, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
        var commandHandler = CommandHandlers[deserialized.Command];
        await commandHandler.ExecuteAsync(deserialized.Payload);
    }
}
