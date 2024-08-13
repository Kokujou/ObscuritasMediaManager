using System.Net.Sockets;

namespace ObscuritasMediaManager.Backend.Services;

public class InteropConnectionChecker
{
    public bool IsConnected { get; private set; }

    public InteropConnectionChecker()
    {
        _ = WaitForResponseAsync();
    }

    public async Task WaitForResponseAsync()
    {
        using var client = new UdpClient(80);
        while (true)
        {
            var result = await client.ReceiveAsync();
            IsConnected = result.Buffer[0] == 1;
        }
    }
}