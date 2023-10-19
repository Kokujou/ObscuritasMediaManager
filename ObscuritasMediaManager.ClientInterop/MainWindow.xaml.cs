using System.IO;
using System.Runtime.CompilerServices;
using System.Windows;

namespace ObscuritasMediaManager.ClientInterop;

public partial class MainWindow : Window
{
    public static string GetProjectPath([CallerFilePath] string currentFilePath = "")
    {
        return Path.GetDirectoryName(currentFilePath)!;
    }

    public NotifyIcon NotifyIcon { get; set; }

    public MainWindow()
    {
        InitializeComponent();

        NotifyIcon = new NotifyIcon();
        NotifyIcon.Visible = true;
        NotifyIcon.Icon = new(Path.Combine(GetProjectPath(), "magic-circle.ico"));
        Hide();

        var server = new WebSocketServer("ws://localhost:8005");
        server.AddWebSocketService<WebSocketInterop>("/Interop");
        server.Start();
    }
}
