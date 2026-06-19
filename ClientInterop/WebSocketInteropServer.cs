using ObscuritasMediaManager.ClientInterop.Attributes;
using ObscuritasMediaManager.ClientInterop.Commands;
using ObscuritasMediaManager.ClientInterop.Events;
using ObscuritasMediaManager.ClientInterop.Queries;
using ObscuritasMediaManager.ClientInterop.Responses;
using System.Reflection;
using WebSocketSharp;

namespace ObscuritasMediaManager.ClientInterop;

public class WebSocketInteropServer() : WebSocketServer("ws://localhost:8005")
{
    private static Dictionary<Guid, WebSocketInteropClient> Clients { get; } = new();
    private static Dictionary<InteropCommand, ICommandHandler> CommandHandlers { get; }
    private static Dictionary<InteropQuery, IQueryHandler> QueryHandlers { get; }

    public static void BroadcastEvent<T>(T response) where T : InteropEventBase
    {
        var isAnonymous = typeof(T).GetCustomAttribute<AllowAnonymousAttribute>() is not null;
        foreach (var client in Clients.Values.Where(x => !isAnonymous || x.Registered))
            client.SendEvent(response);
    }

    public static void SendEventTo<T>(Guid clientId, T response) where T : InteropEventBase
    {
        var isAnonymous = typeof(T).GetCustomAttribute<AllowAnonymousAttribute>() is not null;
        var client = Clients.GetValueOrDefault(clientId);

        if (client is null || (!isAnonymous && !client.Registered)) return;
        client.SendEvent(response);
    }

    public static Guid AddClient(WebSocketInteropClient client)
    {
        var id = Guid.NewGuid();
        Clients.Add(id, client);
        client.OnMessageReceived += e => _ = HandleClientMessage(e, client);

        return id;
    }

    public static void RegisterClient(Guid clientId)
    {
        var client = Clients.GetValueOrDefault(clientId);
        if (client is null) return;

        client.Registered = true;
        client.SendEvent(new ConnectedEvent());
    }

    public static async Task RemoveClientAsync(Guid id)
    {
        Clients.Remove(id);
        if (Clients.Any()) return;

        await CommandHandlers[InteropCommand.StopTrack].ExecuteAsync(null, id);
    }

    public static async Task HandleCommandForAsync(WebSocketInteropClient client, InteropCommandRequest request)
    {
        var commandHandler = CommandHandlers[request.Command];

        if (!client.Registered && commandHandler.GetType().GetCustomAttribute<AllowAnonymousAttribute>() is null)
            return;

        try
        {
            await commandHandler.ExecuteAsync(request.Payload, client.Id);
            client.RespondOnCommand(request, ResponseStatus.Success);
        }
        catch (Exception ex)
        {
            client.RespondOnCommand(request, ResponseStatus.Error, ex.ToString());
        }
    }

    public static async Task HandleQueryForAsync(WebSocketInteropClient client, InteropQueryRequest deserialized)
    {
        var queryHandler = QueryHandlers[deserialized.Query];

        if (!client.Registered && queryHandler.GetType().GetCustomAttribute<AllowAnonymousAttribute>() is null)
            return;

        try
        {
            var result = await queryHandler.ExecuteAsync(deserialized.Payload);
            Clients.GetValueOrDefault(client.Id)?.RespondOnQuery(deserialized, result, ResponseStatus.Success);
        }
        catch (Exception ex)
        {
            Clients.GetValueOrDefault(client.Id)?.RespondOnQuery(deserialized, null, ResponseStatus.Error, ex.Message);
        }
    }

    private static async Task HandleClientMessage(MessageEventArgs e, WebSocketInteropClient client)
    {
        var json = JsonDocument.Parse(e.Data);

        if (json.RootElement.EnumerateObject()
            .Any(x => x.Name.ToLower() == nameof(InteropCommandRequest.Command).ToLower()))
            await HandleCommandForAsync(client,
                JsonSerializer.Deserialize<InteropCommandRequest>(e.Data, WebSocketInteropClient.DefaultJsonOptions)!);
        else
            await HandleQueryForAsync(client,
                JsonSerializer.Deserialize<InteropQueryRequest>(e.Data, WebSocketInteropClient.DefaultJsonOptions)!);
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
        AudioService.TrackEnded += () => BroadcastEvent(new TrackEndedEvent());

        _ = Task.Run(async () =>
        {
            while (true)
                try
                {
                    await Task.Delay(50);

                    if (AudioService.Player.PlaybackState != PlaybackState.Playing) continue;

                    BroadcastEvent(new TrackPositionChangedEvent(
                        AudioService.GetCurrentTrackPosition().TotalMilliseconds, AudioService.VisualizationData));
                }
                catch
                {
                    //s.t.f.u
                }
        });
    }
}