using ObscuritasMediaManager.ClientInterop.Commands;
using ObscuritasMediaManager.ClientInterop.Events;
using ObscuritasMediaManager.ClientInterop.Queries;
using ObscuritasMediaManager.ClientInterop.Responses;
using System.Reflection;

namespace ObscuritasMediaManager.ClientInterop;

public class WebSocketInteropServer() : WebSocketServer("ws://localhost:8005")
{
    private static Dictionary<Guid, WebSocketInteropClient> Clients { get; } = new();
    private static Dictionary<InteropCommand, ICommandHandler> CommandHandlers { get; }
    private static Dictionary<InteropQuery, IQueryHandler> QueryHandlers { get; }

    public static void BroadcastEvent<T>(T response) where T : IInteropEvent
    {
        foreach (var client in Clients.Values) client.SendEvent(response);
    }

    public static void SendEventTo<T>(Guid clientId, T response) where T : IInteropEvent
    {
        Clients[clientId].SendEvent(response);
    }

    public static Guid AddClient(WebSocketInteropClient client)
    {
        var id = Guid.NewGuid();
        Clients.Add(id, client);
        SendEventTo(id, new ConnectedEvent());

        return id;
    }

    public static async Task RemoveClientAsync(Guid id)
    {
        Clients.Remove(id);
        if (Clients.Any()) return;

        await CommandHandlers[InteropCommand.StopTrack].ExecuteAsync(null);
    }

    public static async Task HandleCommandForAsync(Guid clientId, InteropCommandRequest request)
    {
        var commandHandler = CommandHandlers[request.Command];
        try
        {
            await commandHandler.ExecuteAsync(request.Payload);
            Clients[clientId].RespondOnCommand(request, ResponseStatus.Success);
        }
        catch (Exception ex)
        {
            Clients[clientId].RespondOnCommand(request, ResponseStatus.Error, ex.ToString());
        }
    }

    public static async Task HandleQueryForAsync(Guid clientId, InteropQueryRequest deserialized)
    {
        var queryHandler = QueryHandlers[deserialized.Query];
        try
        {
            var result = await queryHandler.ExecuteAsync(deserialized.Payload);
            Clients[clientId].RespondOnQuery(deserialized, result, ResponseStatus.Success);
        }
        catch (Exception ex)
        {
            Clients[clientId].RespondOnQuery(deserialized, null, ResponseStatus.Error, ex.Message);
        }
    }

    static WebSocketInteropServer()
    {
        var exportedTypes = Assembly.GetExecutingAssembly().GetExportedTypes();

        CommandHandlers = exportedTypes
            .Where(x => typeof(ICommandHandler).IsAssignableFrom(x))
            .Select(Activator.CreateInstance)
            .ToDictionary(x => ((ICommandHandler)x!).Command, x => (ICommandHandler)x!);

        QueryHandlers = exportedTypes
            .Where(x => typeof(IQueryHandler).IsAssignableFrom(x))
            .Select(Activator.CreateInstance)
            .ToDictionary(x => ((IQueryHandler)x!).Query, x => (IQueryHandler)x!);

        AudioService.PlaybackStateChanged += state => BroadcastEvent(new PlaybackStateChangedEvent(state));
        AudioService.TrackChanged += (path, duration) => BroadcastEvent(new TrackChangedEvent(path, duration));
        AudioService.TrackPositionChanged +=
            (position, data) => BroadcastEvent(new TrackPositionChangedEvent(position.TotalMilliseconds, data));
        AudioService.TrackVolumeChanged += volume => BroadcastEvent(new VolumeChangedEvent(volume));
    }
}